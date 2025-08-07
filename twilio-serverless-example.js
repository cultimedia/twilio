// Twilio Serverless Function: /send-sms-prompt
// This should be deployed to your Twilio Functions service

exports.handler = function(context, event, callback) {
  // Enable CORS
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');
  
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, response);
  }
  
  // Validate required parameters
  const { phoneNumber, conversationId } = event;
  
  if (!phoneNumber) {
    response.setStatusCode(400);
    response.setBody({
      success: false,
      error: 'phoneNumber is required'
    });
    return callback(null, response);
  }
  
  if (!conversationId) {
    response.setStatusCode(400);
    response.setBody({
      success: false,
      error: 'conversationId is required'
    });
    return callback(null, response);
  }
  
  // Initialize Twilio client
  const client = context.getTwilioClient();
  
  // Your Twilio phone number (from environment variables)
  const fromNumber = context.TWILIO_PHONE_NUMBER || '+15806663999';
  
  // SMS message content
  const messageBody = `Perfect, I'll send you a text now where you can reply with your email.`;
  
  // Send the SMS
  client.messages
    .create({
      body: messageBody,
      from: fromNumber,
      to: phoneNumber
    })
    .then(message => {
      console.log(`SMS sent successfully. SID: ${message.sid}`);
      
      // Store the conversation mapping (you might want to use a database)
      // For now, we'll just use the message SID as tracking ID
      const trackingId = message.sid;
      
      response.setBody({
        success: true,
        trackingId: trackingId,
        messageSid: message.sid,
        conversationId: conversationId
      });
      
      callback(null, response);
    })
    .catch(error => {
      console.error('SMS sending failed:', error);
      
      response.setStatusCode(500);
      response.setBody({
        success: false,
        error: 'Failed to send SMS',
        details: error.message
      });
      
      callback(null, response);
    });
};

// Alternative version with async/await
exports.handlerAsync = async function(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');
  
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, response);
  }
  
  try {
    const { phoneNumber, conversationId } = event;
    
    if (!phoneNumber || !conversationId) {
      response.setStatusCode(400);
      response.setBody({
        success: false,
        error: 'phoneNumber and conversationId are required'
      });
      return callback(null, response);
    }
    
    const client = context.getTwilioClient();
    const fromNumber = context.TWILIO_PHONE_NUMBER || '+15806663999';
    
    const message = await client.messages.create({
      body: 'Perfect, I\'ll send you a text now where you can reply with your email.',
      from: fromNumber,
      to: phoneNumber
    });
    
    response.setBody({
      success: true,
      trackingId: message.sid,
      messageSid: message.sid,
      conversationId: conversationId
    });
    
    callback(null, response);
    
  } catch (error) {
    console.error('SMS Error:', error);
    response.setStatusCode(500);
    response.setBody({
      success: false,
      error: 'Failed to send SMS',
      details: error.message
    });
    callback(null, response);
  }
};