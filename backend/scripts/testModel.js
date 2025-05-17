const { getGeminiModel } = require('../config/gemini');
require('dotenv').config();

async function testModel() {
  try {
    console.log("Testing gemini-pro model via REST API (v1)...");
    
    const model = getGeminiModel();
    const prompt = "Say hello in one word";
    console.log("\nSending prompt:", prompt);
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log("\nResponse:", text);
    console.log("\nModel worked successfully!");
    
  } catch (error) {
    console.error("\nError testing model:", {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
      details: error.response?.data?.error?.details || 'No additional details'
    });
  }
}

testModel(); 