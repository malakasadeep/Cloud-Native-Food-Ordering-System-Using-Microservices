import axios from 'axios';

export const sendSMS = async (mobile, message) => {
  if (!mobile || typeof mobile !== 'string') {
    const error = new Error('Invalid mobile number format');
    error.statusCode = 400;
    throw error;
  }

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://xk8z1q.api.infobip.com/sms/2/text/advanced',
      headers: {
        'Authorization': 'App d97962ed12ebccd0870087ab1b3fc066-e50be66a-ad92-4cf5-9747-b77f9d89e1b2',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        "messages": [
          {
            "destinations": [{ "to": mobile }],
            "from": "447491163443",
            "text": message
          }
        ]
      },
      timeout: 10000 // 10s timeout
    });

    console.log('SMS API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('SMS API Error:', error.response?.data || error.message);
    

    const customError = new Error(
      error.response?.data?.message || error.message || 'Failed to send SMS'
    );
    

    customError.statusCode = error.response?.status || 500;
    customError.originalError = error;
    
    throw customError;
  }
};

