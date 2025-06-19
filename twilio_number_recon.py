import os
import time
import sys
from twilio.rest import Client
from dotenv import load_dotenv
from typing import List, Tuple

# Load environment variables
load_dotenv()
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')

if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
    print("\n[ERROR] Twilio credentials not found. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your environment.\n")
    sys.exit(1)

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Vanity mapping helper
def vanity_to_number(vanity: str) -> str:
    """Convert a vanity string (e.g., THE-GATE) to its numeric phone equivalent."""
    mapping = {
        'A': '2', 'B': '2', 'C': '2',
        'D': '3', 'E': '3', 'F': '3',
        'G': '4', 'H': '4', 'I': '4',
        'J': '5', 'K': '5', 'L': '5',
        'M': '6', 'N': '6', 'O': '6',
        'P': '7', 'Q': '7', 'R': '7', 'S': '7',
        'T': '8', 'U': '8', 'V': '8',
        'W': '9', 'X': '9', 'Y': '9', 'Z': '9',
    }
    return ''.join(mapping.get(c.upper(), c) for c in vanity if c.isalnum())

# Tier 1: Sacred Subversion
tier1 = [
    ("580-666-HOLY", "5806664659"),
    ("580-666-PRAY", "5806667729"),
    ("580-666-HYMN", "5806664966"),
]

# Tier 2: Divine Paradox
tier2 = [
    ("580-666-SOUL", "5806667685"),
    ("580-666-SAGE", "5806667243"),
    ("580-666-MYTH", "5806666984"),
]

# Tier 3: Philosophical Violence
tier3 = [
    ("580-666-TRUE", "5806668783"),
    ("580-666-REAL", "5806667325"),
]

# GATE variations
gate_variations = [
    ("580-666-GATE", "5806664283"),
    ("580-THE-GATE", "5808434283"),
]

# Tier 2 Pattern Exchanges
tier2_patterns = [
    ("580-777-XXXX", "580777"),
    ("580-888-XXXX", "580888"),
    ("580-333-XXXX", "580333"),
    ("580-666-XXXX", "580666"),
]

# Tier 3 and 4 can be added similarly

def check_number_availability(phone_number: str) -> Tuple[str, str]:
    """Check if a specific phone number is available on Twilio."""
    try:
        numbers = client.available_phone_numbers('US').local.list(
            area_code=phone_number[:3],
            contains=phone_number,
            sms_enabled=True,
            voice_enabled=True,
            limit=1
        )
        if numbers:
            return ("AVAILABLE", numbers[0].phone_number)
        else:
            return ("TAKEN", None)
    except Exception as e:
        return (f"ERROR: {str(e)}", None)

def check_pattern_availability(prefix: str) -> int:
    """Count available numbers in a given exchange (e.g., 580777)."""
    try:
        numbers = client.available_phone_numbers('US').local.list(
            area_code=prefix[:3],
            contains=prefix,
            sms_enabled=True,
            voice_enabled=True,
            limit=20
        )
        return len(numbers)
    except Exception:
        return -1

def get_all_available_numbers(prefix: str) -> List[str]:
    """Get all available numbers in a given exchange."""
    try:
        numbers = client.available_phone_numbers('US').local.list(
            area_code=prefix[:3],
            contains=prefix,
            sms_enabled=True,
            voice_enabled=True,
            limit=20
        )
        return [number.phone_number for number in numbers]
    except Exception as e:
        print(f"Error fetching numbers: {str(e)}")
        return []

def main():
    print("\n🕷️ PHONE NUMBER RECONNAISSANCE REPORT\n" + "="*45 + "\n")
    
    # Check 580-777-HELL
    hell_number = "5807774355"  # HELL = 4355
    print("CHECKING HELL'S LINE:")
    status, found = check_number_availability(hell_number)
    if status == "AVAILABLE":
        print(f"✅ 580-777-HELL ({hell_number}) - AVAILABLE")
    elif status == "TAKEN":
        print(f"❌ 580-777-HELL ({hell_number}) - TAKEN")
    else:
        print(f"⚠️  580-777-HELL ({hell_number}) - {status}")
    time.sleep(0.7)

    print("\nTIER 1: SACRED SUBVERSION")
    for label, num in tier1:
        status, found = check_number_availability(num)
        if status == "AVAILABLE":
            print(f"✅ {label} ({num}) - AVAILABLE")
        elif status == "TAKEN":
            print(f"❌ {label} ({num}) - TAKEN")
        else:
            print(f"⚠️  {label} ({num}) - {status}")
        time.sleep(0.7)

    # Get all available 666 numbers
    print("\nAVAILABLE 666 EXCHANGE NUMBERS:")
    available_666 = get_all_available_numbers("580666")
    if available_666:
        for number in available_666:
            formatted = f"{number[:3]}-{number[3:6]}-{number[6:]}"
            print(f"📞 {formatted}")
    else:
        print("No numbers currently available in 666 exchange")

    print("\nPSYCHOLOGICAL IMPACT ASSESSMENT:")
    print("The combination of '777' (divine perfection) with 'HELL' creates\n"
          "a perfect tension between sacred and profane. The available 666\n"
          "numbers offer backup options with built-in mythological weight.")

if __name__ == "__main__":
    main() 