// Voiceflow SMS Integration - Corrected Version
// This script sends an SMS prompt to collect email addresses

try {
  // Debug logging - Check variable values
  const userNumber = variables.get('userNumber');
  const sessionId = variables.get('sessionid') || variables.get('$request.sessionid') || variables.get('session_id');
  
  console.log('User Number:', userNumber);
  console.log('Session ID:', sessionId);
  
  // Validate required variables
  if (!userNumber) {
    console.error('userNumber variable is missing or empty');
    return 'sms_failed';
  }
  
  if (!sessionId) {
    console.error('sessionId variable is missing or empty');
    return 'sms_failed';
  }
  
  // Make the API request
  const response = await fetch('https://email-collection-sms-8387.twil.io/send-sms-prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      phoneNumber: userNumber,
      conversationId: sessionId
    })
  });
  
  // Check if the response is ok
  if (!response.ok) {
    console.error('HTTP Error:', response.status, response.statusText);
    const errorText = await response.text();
    console.error('Error details:', errorText);
    return 'sms_failed';
  }
  
  // Parse the response
  const result = await response.json();
  console.log('API Response:', result);
  
  if (result.success) {
    variables.set('sms_tracking_id', result.trackingId);
    console.log('SMS sent successfully, tracking ID:', result.trackingId);
    return 'sms_sent';
  } else {
    console.error('API returned failure:', result.error || result.message || 'Unknown error');
    return 'sms_failed';
  }
  
} catch (error) {
  console.error('Unexpected error:', error.message);
  console.error('Full error:', error);
  return 'sms_failed';
}