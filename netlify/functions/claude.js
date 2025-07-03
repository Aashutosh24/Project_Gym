const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    // Get API key from environment variables
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    
    if (!CLAUDE_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Claude API key not configured" })
      };
    }

    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS"
        },
        body: ""
      };
    }

    // Parse request body
    const { height, weight, goal, age, activityLevel } = JSON.parse(event.body || '{}');
    
    if (!height || !weight || !goal) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Missing required fields: height, weight, and goal" })
      };
    }

    // Create enhanced prompt for Claude
    const prompt = createFitnessPrompt(height, weight, goal, age, activityLevel);

    // Call Claude API
    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    // Check for API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Claude API error: ${response.status} - ${errorText}`);
      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ 
          error: `Claude API error: ${response.status}`,
          details: errorText
        })
      };
    }

    // Process successful response
    const data = await response.json();
    const reply = data?.content?.[0]?.text || "No response received. Please try again.";

    // Return successful response with CORS headers
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.log("Function error:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};

function createFitnessPrompt(height, weight, goal, age, activityLevel) {
  const ageText = age ? ` I am ${age} years old.` : "";
  const activityText = activityLevel ? ` My current activity level is ${activityLevel}.` : "";
  
  return `As a certified fitness and nutrition expert, please provide personalized recommendations for someone with the following profile:

Height: ${height} cm
Weight: ${weight} kg
Primary Goal: ${goal}${ageText}${activityText}

Please provide a comprehensive response with the following structure:

🎯 **CALORIE TARGETS:**
- Daily calorie goal
- Explanation of calorie calculation

🥗 **MACRONUTRIENT BREAKDOWN:**
- Protein: grams and percentage
- Carbohydrates: grams and percentage  
- Fats: grams and percentage

🏋️ **EXERCISE RECOMMENDATIONS:**
- Weekly workout schedule
- Specific exercise types
- Duration and intensity guidelines

💡 **GENERAL FITNESS TIPS:**
- 3-4 key actionable tips
- Lifestyle recommendations

Please keep the response concise but comprehensive, focusing on practical, actionable advice. Use clear formatting with emojis to make it easy to read.`;
}