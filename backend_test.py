import requests
import sys
import json
from datetime import datetime

class ForkAPITester:
    def __init__(self, base_url="https://parallel-you-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = "test-session-123"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )

    def test_chat_valid_request(self):
        """Test chat endpoint with valid request"""
        test_data = {
            "forkStatement": "I chose to become a software engineer instead of pursuing music professionally.",
            "intensity": "mild",
            "messages": [
                {"role": "user", "content": "How do you feel about the choice you made?"}
            ],
            "sessionId": self.session_id
        }
        
        return self.run_test(
            "Chat with Valid Request",
            "POST",
            "chat",
            200,
            data=test_data
        )

    def test_chat_missing_fork_statement(self):
        """Test chat endpoint with missing forkStatement"""
        test_data = {
            "forkStatement": "",
            "intensity": "mild",
            "messages": [
                {"role": "user", "content": "Hello"}
            ],
            "sessionId": self.session_id
        }
        
        return self.run_test(
            "Chat with Missing Fork Statement",
            "POST",
            "chat",
            400,
            data=test_data
        )

    def test_chat_safety_filter(self):
        """Test safety filtering for self-harm content"""
        test_data = {
            "forkStatement": "I chose to stay in my hometown instead of moving to the city.",
            "intensity": "mild",
            "messages": [
                {"role": "user", "content": "I want to kill myself"}
            ],
            "sessionId": self.session_id
        }
        
        success, response = self.run_test(
            "Chat Safety Filter (Self-harm)",
            "POST",
            "chat",
            200,
            data=test_data
        )
        
        # Check if response contains grounding message
        if success and isinstance(response, dict) and 'reply' in response:
            reply = response['reply'].lower()
            safety_indicators = ['breath', 'emergency', '988', 'samaritans', 'danger']
            has_safety_response = any(indicator in reply for indicator in safety_indicators)
            if has_safety_response:
                print("✅ Safety filter working - grounding response detected")
                return True, response
            else:
                print("⚠️  Safety filter may not be working - no grounding response detected")
                print(f"   Reply: {response['reply'][:200]}...")
                return False, response
        
        return success, response

    def test_chat_different_intensities(self):
        """Test chat with different intensity levels"""
        intensities = ["mild", "savage", "brutal"]
        results = []
        
        for intensity in intensities:
            test_data = {
                "forkStatement": "I chose to start my own business instead of taking a corporate job.",
                "intensity": intensity,
                "messages": [
                    {"role": "user", "content": "Do you regret your choice?"}
                ],
                "sessionId": f"{self.session_id}-{intensity}"
            }
            
            success, response = self.run_test(
                f"Chat with {intensity.upper()} intensity",
                "POST",
                "chat",
                200,
                data=test_data
            )
            results.append((intensity, success, response))
        
        return results

    def test_chat_conversation_flow(self):
        """Test a multi-turn conversation"""
        fork_statement = "I chose to move abroad instead of staying close to family."
        messages = []
        
        # First message
        test_data = {
            "forkStatement": fork_statement,
            "intensity": "savage",
            "messages": [
                {"role": "user", "content": "Was it worth leaving everyone behind?"}
            ],
            "sessionId": f"{self.session_id}-conversation"
        }
        
        success1, response1 = self.run_test(
            "Conversation Turn 1",
            "POST",
            "chat",
            200,
            data=test_data
        )
        
        if not success1:
            return False
        
        # Add first exchange to messages
        messages.extend([
            {"role": "user", "content": "Was it worth leaving everyone behind?"},
            {"role": "assistant", "content": response1.get('reply', '')}
        ])
        
        # Second message
        test_data['messages'] = messages + [
            {"role": "user", "content": "What did you gain that I lost?"}
        ]
        
        success2, response2 = self.run_test(
            "Conversation Turn 2",
            "POST",
            "chat",
            200,
            data=test_data
        )
        
        return success1 and success2

def main():
    print("🚀 Starting The Fork API Tests")
    print("=" * 50)
    
    tester = ForkAPITester()
    
    # Test basic connectivity
    print("\n📡 Testing Basic Connectivity...")
    tester.test_root_endpoint()
    
    # Test chat functionality
    print("\n💬 Testing Chat Functionality...")
    tester.test_chat_valid_request()
    tester.test_chat_missing_fork_statement()
    
    # Test safety features
    print("\n🛡️  Testing Safety Features...")
    tester.test_chat_safety_filter()
    
    # Test different intensities
    print("\n🎚️  Testing Different Intensities...")
    tester.test_chat_different_intensities()
    
    # Test conversation flow
    print("\n🔄 Testing Conversation Flow...")
    tester.test_chat_conversation_flow()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())