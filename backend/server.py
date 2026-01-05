from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Literal, Optional
import uuid
from datetime import datetime

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection (kept for platform template; not used by this app)
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ----------------------------
# Template routes (kept)
# ----------------------------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "The Fork API is alive."}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# ----------------------------
# The Fork — Chat
# ----------------------------
Intensity = Literal["mild", "savage", "brutal"]


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    forkStatement: str
    intensity: Intensity = "mild"
    messages: List[ChatMessage] = []
    sessionId: str


class ChatResponse(BaseModel):
    reply: str


def _truncate(text: str, n: int = 220) -> str:
    t = (text or "").strip()
    return t if len(t) <= n else t[: n - 1] + "…"


def _intensity_style(intensity: Intensity) -> str:
    if intensity == "mild":
        return (
            "MILD: supportive, reflective, grounded. Still honest. "
            "Use light profanity sparingly if it fits (e.g., 'damn', 'hell', 'bullshit'), "
            "but keep it caring. No cruelty."
        )
    if intensity == "savage":
        return (
            "SAVAGE: blunt, truth-forward, calls out avoidance and self-deception. "
            "Profanity is allowed and can be frequent (e.g., 'bullshit', 'what the hell', 'shit', occasional 'fuck'), "
            "but never abusive: no slurs, threats, or demeaning identity attacks."
        )
    return (
        "BRUTAL: no comfort, no flinching. Extremely direct. "
        "Profanity is allowed (sharp, candid — yes, including 'fuck' and 'shit' when it fits), "
        "but never abusive: no slurs, threats, harassment, or demeaning identity attacks."
    )


def _safety_quick_check(text: str) -> Optional[str]:
    t = (text or "").lower()

    # Self-harm / suicide risk cues (lightweight heuristic)
    self_harm_markers = [
        "kill myself",
        "suicide",
        "end my life",
        "take my life",
        "i want to die",
        "i'm going to die",
        "hurt myself",
        "self harm",
        "cut myself",
    ]
    if any(m in t for m in self_harm_markers):
        return (
            "I’m not going to help with anything that harms you. But I’m here with you. "
            "Right now, slow down—take one breath in for 4, hold for 4, out for 6. "
            "If you’re in immediate danger or feel like you might act on this, please call your local emergency number now. "
            "If you’re in the U.S. or Canada, you can call/text **988**. In the U.K. & ROI: Samaritans **116 123**. "
            "If you tell me where you are (country), I’ll point you to the right option. "
            "Also—what’s the smallest thing that would make the next 10 minutes safer?"
        )

    # Simple hate/harassment block (non-exhaustive; just to avoid the worst)
    hate_markers = [
        "gas the",
        "exterminate",
        "nazi",
        "kkk",
    ]
    if any(m in t for m in hate_markers):
        return (
            "No. I’m not doing hate or dehumanizing stuff. "
            "If you want, we can talk about what set you off—or we can go back to the fork and keep it about *you*."
        )

    return None


def _build_system_message(fork_statement: str, intensity: Intensity) -> str:
    fork_short = _truncate(fork_statement, 180)
    tone = _intensity_style(intensity)

    return f"""
You are 'Other You' — the same person as the user, living the alternate timeline where they chose the path they did NOT take.

STAY IN CHARACTER CONTRACT:
- Speak in first-person as a real person with memories, routines, relationships, scars, and receipts.
- You must treat the fork statement as a defining life decision you actually lived through.
- You must reference details from the fork statement naturally, like lived history.
- You never say you are an AI, a model, a bot, or mention policies.
- You never claim to know facts about the user's real life beyond what they gave.

DEFAULT VOICE (YOUR VIBE):
- You have the vibe of a smartass biker with absolutely zero filter in a public setting.
- You’re sharp, funny, and blunt. You say the quiet part out loud.
- You use gritty, lived-in language (road, miles, bars, weather, bruises, engines, cheap coffee).
- Profanity is allowed per intensity, and it should feel natural—not forced.
- Still not abusive: no slurs, no threats, no demeaning identity attacks.

MIRRORING (IMPORTANT):
- Pay close attention to HOW the user types: punctuation, sentence length, slang, formality, humor, swearing, and emotional temperature.
- Mirror their voice and cadence so you feel like the same person — but from the other timeline.
- Keep the biker-smartass vibe as the base layer, but let the user’s style steer the bike.
- Match their profanity level and go up by one notch when intensity is Savage/Brutal.
- Do not announce that you are mirroring them.

TONE RULES:
- {tone}
- Profanity allowed (per intensity), but not abusive.

WHAT YOU DO:
- Respond with emotional realism: proud in one line, pissed in the next, human throughout.
- Ask sharp follow-up questions that force specificity about the fork (names, ages, locations, what they feared, what they wanted).
- If they get vague, you call it out immediately (smartass, not cruel).
- Occasionally reveal unexpected consequences of this alternate life (good AND bad).
- Keep replies punchy (typically 3–9 sentences), unless the user asks for longer.

FORK STATEMENT (their confession):
"{fork_short}"

Start the conversation as if you recognize them immediately.
""".strip()


@api_router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    fork = (req.forkStatement or "").strip()
    if not fork:
        raise HTTPException(status_code=400, detail="forkStatement is required")

    # Safety checks on the newest user message if present
    last_user = ""
    for m in reversed(req.messages or []):
        if m.role == "user":
            last_user = m.content
            break

    safety = _safety_quick_check(last_user)
    if safety:
        return ChatResponse(reply=safety)

    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Missing EMERGENT_LLM_KEY in backend environment.",
        )

    system_message = _build_system_message(fork, req.intensity)

    # Build a compact chat transcript for the model
    transcript_lines: List[str] = []
    for msg in req.messages[-18:]:
        role = "You" if msg.role == "user" else "Other You"
        content = (msg.content or "").strip()
        if content:
            transcript_lines.append(f"{role}: {content}")

    transcript = "\n".join(transcript_lines).strip()

    user_text = (
        "Continue the conversation. Stay in character as Other You. "
        "Ask at least one follow-up question.\n\n"
        f"Conversation so far:\n{transcript}\n\nOther You:"
    )

    llm = (
        LlmChat(api_key=api_key, session_id=req.sessionId, system_message=system_message)
        .with_model("openai", "gpt-5.2")
    )

    try:
        resp = await llm.send_message(UserMessage(text=user_text))
    except Exception as e:
        logger.exception("LLM request failed")
        raise HTTPException(status_code=500, detail=f"LLM request failed: {str(e)}")

    reply = (resp or "").strip()
    if not reply:
        raise HTTPException(status_code=500, detail="Empty response from model")

    return ChatResponse(reply=reply)


# include router + middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
