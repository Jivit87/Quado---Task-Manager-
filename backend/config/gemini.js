const axios = require('axios');

const generateContent = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message
    });
    throw error;
  }
};

// Function to get the Gemini model (now returns a function that uses REST API)
const getGeminiModel = () => {
  return {
    generateContent: async (prompt) => {
      const text = await generateContent(prompt);
      return {
        response: {
          text: () => text
        }
      };
    }
  };
};

module.exports = { getGeminiModel };