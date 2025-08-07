// Alternative SMS Integration Approaches for Voiceflow

// VERSION 1: Minimal with basic error handling
async function sendSMSMinimal() {
  try {
    const response = await fetch('https://email-collection-sms-8387.twil.io/send-sms-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: variables.get('userNumber'),
        conversationId: variables.get('sessionid')
      })
    });
    
    const result = await response.json();
    return result.success ? 'sms_sent' : 'sms_failed';
  } catch (error) {
    return 'sms_failed';
  }
}

// VERSION 2: For newer Voiceflow versions (2023+)
async function sendSMSNewVoiceflow() {
  try {
    const userNumber = variables.userNumber || variables.get('userNumber');
    const sessionId = variables.sessionid || variables.get('sessionid');
    
    const response = await fetch('https://email-collection-sms-8387.twil.io/send-sms-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: userNumber,
        conversationId: sessionId
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const result = await response.json();
    if (result.success) {
      variables.set('sms_tracking_id', result.trackingId);
      return 'sms_sent';
    }
    return 'sms_failed';
  } catch (error) {
    return 'sms_failed';
  }
}

// VERSION 3: Direct variable access (if variables object behaves differently)
async function sendSMSDirect() {
  try {
    const phoneNumber = userNumber || variables.userNumber; // Direct access
    const convId = sessionid || variables.sessionid; // Direct access
    
    const response = await fetch('https://email-collection-sms-8387.twil.io/send-sms-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        conversationId: convId
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      variables.set('sms_tracking_id', result.trackingId);
      return 'sms_sent';
    }
    return 'sms_failed';
  } catch (error) {
    return 'sms_failed';
  }
}

// VERSION 4: Hardcoded test version for debugging
async function sendSMSTest() {
  try {
    const response = await fetch('https://email-collection-sms-8387.twil.io/send-sms-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: '+15806663999', // Your test number
        conversationId: 'test-session-' + Date.now()
      })
    });
    
    const result = await response.json();
    return result.success ? 'sms_sent' : 'sms_failed';
  } catch (error) {
    return 'sms_failed';
  }
}

// DEBUGGING VERSION: Maximum logging
async function sendSMSDebug() {
  console.log('=== SMS DEBUG START ===');
  
  // Log all available variables
  console.log('Variables object:', typeof variables);
  console.log('Available methods:', Object.getOwnPropertyNames(variables));
  
  // Try different ways to access variables
  const userNumber1 = variables.get('userNumber');
  const userNumber2 = variables.userNumber;
  const sessionId1 = variables.get('sessionid');
  const sessionId2 = variables.get('$request.sessionid');
  const sessionId3 = variables.sessionid;
  
  console.log('userNumber methods:', { userNumber1, userNumber2 });
  console.log('sessionId methods:', { sessionId1, sessionId2, sessionId3 });
  
  const finalUserNumber = userNumber1 || userNumber2;
  const finalSessionId = sessionId1 || sessionId2 || sessionId3;
  
  console.log('Final values:', { finalUserNumber, finalSessionId });
  
  if (!finalUserNumber || !finalSessionId) {
    console.error('Missing required variables');
    return 'sms_failed';
  }
  
  try {
    console.log('Making fetch request...');
    const response = await fetch('https://email-collection-sms-8387.twil.io/send-sms-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: finalUserNumber,
        conversationId: finalSessionId
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const result = await response.json();
    console.log('Response body:', result);
    
    if (result.success) {
      variables.set('sms_tracking_id', result.trackingId);
      console.log('SMS sent successfully');
      return 'sms_sent';
    } else {
      console.error('API returned failure:', result);
      return 'sms_failed';
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return 'sms_failed';
  }
}