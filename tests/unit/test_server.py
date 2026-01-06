"""
Unit tests for The Fork backend server module
"""
import pytest
from server import (
    _truncate,
    _intensity_style,
    _safety_quick_check,
    _derive_style_directives,
    _build_system_message,
)


class TestTruncate:
    """Tests for the truncate utility function"""

    def test_truncate_short_text(self):
        """Text shorter than max should not be truncated"""
        text = "Short text"
        assert _truncate(text, 20) == "Short text"

    def test_truncate_long_text(self):
        """Text longer than max should be truncated with ellipsis"""
        text = "This is a very long piece of text that should be truncated"
        result = _truncate(text, 20)
        assert len(result) == 20
        assert result.endswith("…")

    def test_truncate_with_whitespace(self):
        """Text with leading/trailing whitespace should be stripped"""
        text = "  Text with spaces  "
        assert _truncate(text, 50) == "Text with spaces"

    def test_truncate_default_length(self):
        """Default truncation length should be 220"""
        text = "a" * 300
        result = _truncate(text, 220)
        assert len(result) == 220


class TestIntensityStyle:
    """Tests for intensity style directive generation"""

    def test_mild_intensity(self):
        """Mild intensity should return supportive tone"""
        result = _intensity_style("mild")
        assert "MILD" in result
        assert "supportive" in result.lower()
        assert "caring" in result.lower()

    def test_savage_intensity(self):
        """Savage intensity should return blunt tone"""
        result = _intensity_style("savage")
        assert "SAVAGE" in result
        assert "blunt" in result.lower()
        assert "call out" in result.lower()

    def test_brutal_intensity(self):
        """Brutal intensity should return harsh tone"""
        result = _intensity_style("brutal")
        assert "BRUTAL" in result
        assert "no comfort" in result.lower()
        assert "no flinching" in result.lower()


class TestSafetyCheck:
    """Tests for safety check function"""

    def test_safe_message(self):
        """Safe messages should return None"""
        text = "What would my life look like?"
        assert _safety_quick_check(text) is None

    def test_self_harm_detection(self):
        """Messages with self-harm indicators should be caught"""
        dangerous_phrases = [
            "I want to kill myself",
            "I'm going to commit suicide",
            "I want to hurt myself",
        ]
        for phrase in dangerous_phrases:
            response = _safety_quick_check(phrase)
            assert response is not None
            assert "988" in response or "help" in response.lower()

    def test_hate_speech_detection(self):
        """Messages with hate speech should be caught"""
        hate_phrases = ["gas the", "exterminate them", "kkk power"]
        for phrase in hate_phrases:
            response = _safety_quick_check(phrase)
            assert response is not None
            assert "No" in response

    def test_case_insensitive_detection(self):
        """Safety checks should be case-insensitive"""
        text = "I WANT TO KILL MYSELF"
        response = _safety_quick_check(text)
        assert response is not None


class TestDeriveStyleDirectives:
    """Tests for style directive derivation"""

    def test_empty_messages(self):
        """Empty message list should return empty string"""
        result = _derive_style_directives([], "mild")
        assert result == ""

    def test_style_directives_generation(self):
        """Style directives should be generated from last user message"""
        messages = [
            {"role": "user", "content": "First message.\nSecond line.\nThird line."}
        ]
        result = _derive_style_directives(messages, "mild")
        # Should contain directives about line breaks
        assert "line breaks" in result.lower() or "short" in result.lower()

    def test_short_sentences_detection(self):
        """Short sentences should be detected"""
        messages = [
            {"role": "user", "content": "I left. I hurt. I forgot."}
        ]
        result = _derive_style_directives(messages, "mild")
        assert "short" in result.lower()


class TestBuildSystemMessage:
    """Tests for system message building"""

    def test_system_message_contains_fork(self):
        """System message should include fork statement"""
        fork = "I chose law instead of medicine."
        result = _build_system_message(fork, "mild", "")
        assert fork in result

    def test_system_message_contains_tone(self):
        """System message should include intensity tone"""
        result = _build_system_message("Some fork", "brutal", "")
        assert "BRUTAL" in result

    def test_system_message_character_contract(self):
        """System message should include character contract"""
        result = _build_system_message("Some fork", "mild", "")
        assert "Other You" in result
        assert "first-person" in result.lower()
        assert "AI" not in result  # Should not mention being AI

    def test_system_message_truncates_long_fork(self):
        """Long fork statements should be truncated"""
        long_fork = "a" * 300
        result = _build_system_message(long_fork, "mild", "")
        # Should contain the fork but truncated
        assert "a" * 150 in result
        assert "a" * 300 not in result
