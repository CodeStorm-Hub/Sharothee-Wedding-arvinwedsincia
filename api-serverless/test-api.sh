#!/bin/bash

# Test script for the serverless email API
# Usage: ./test-api.sh [API_URL]

API_URL="${1:-http://localhost:3000/api/send-email}"

echo "Testing Serverless Email API"
echo "API URL: $API_URL"
echo ""

# Test 1: Contact Form Submission
echo "Test 1: Contact Form Submission"
echo "================================"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "formType": "Contact",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+1234567890",
      "subject": "Test Message",
      "message": "This is a test message from the API test script"
    }
  }')

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 2: RSVP Form Submission
echo "Test 2: RSVP Form Submission"
echo "============================="
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "formType": "RSVP",
    "data": {
      "guestName": "John Doe",
      "willAttendDhaka": "yes",
      "familySide": "bride",
      "guestCountOption": "2",
      "additionalInfo": "Looking forward to the wedding!",
      "contact": {
        "email": "john.doe@example.com",
        "preferred": {
          "number": "+1234567890",
          "whatsapp": true,
          "botim": false
        },
        "secondary": {
          "number": "",
          "whatsapp": false,
          "botim": false
        },
        "emergency": {
          "name": "Jane Doe",
          "phone": "+0987654321",
          "email": "jane.doe@example.com"
        }
      }
    }
  }')

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 3: Invalid formType
echo "Test 3: Invalid formType (should fail)"
echo "======================================"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "formType": "Invalid",
    "data": {
      "name": "Test"
    }
  }')

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 4: Missing data
echo "Test 4: Missing data (should fail)"
echo "=================================="
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "formType": "Contact"
  }')

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

echo "Tests completed!"
