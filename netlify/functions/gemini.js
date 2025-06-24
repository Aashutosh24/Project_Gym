// netlify/functions/gemini.js

// export async function handler(event, context) {
//   const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

//   const { prompt } = JSON.parse(event.body);

//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ]
//       })
//     }
//   );

//   const data = await response.json();

//   const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response. Try again.";

//   return {
//     statusCode: 200,
//     body: JSON.stringify({ reply })
//   };
// }

// import fetch from 'node-fetch';

// const fetch = require("node-fetch");

// exports.handler = async function(event, context) {
//   const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//   const { prompt } = JSON.parse(event.body);

//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ]
//       })
//     }
//   );

//   const data = await response.json();

//   const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response. Try again.";

//   return {
//     statusCode: 200,
//     body: JSON.stringify({ reply })
//   };
// };

// Import node-fetch (required for Netlify Functions)
// const fetch = require("node-fetch");

// // Use CommonJS module format (required by Netlify Functions)
// exports.handler = async function(event, context) {
//   try {
//     // Get API key from environment variables
//     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
//     if (!GEMINI_API_KEY) {
//       console.log("Missing API key in environment variables");
//       return {
//         statusCode: 500,
//         body: JSON.stringify({ error: "API key not configured" })
//       };
//     }

//     // Parse request body
//     const { prompt } = JSON.parse(event.body || '{}');
    
//     if (!prompt) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "Missing prompt parameter" })
//       };
//     }

//     // Call Gemini API
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: prompt }]
//             }
//           ]
//         })
//       }
//     );

//     // Check for API errors
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.log(`Gemini API error: ${response.status} - ${errorText}`);
//       return {
//         statusCode: response.status,
//         body: JSON.stringify({ 
//           error: `Gemini API error: ${response.status}`,
//           details: errorText
//         })
//       };
//     }

//     // Process successful response
//     const data = await response.json();
//     const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response. Try again.";

//     // Return successful response with CORS headers
//     return {
//       statusCode: 200,
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*"  // Enable CORS
//       },
//       body: JSON.stringify({ reply })
//     };
//   } catch (error) {
//     // Log and return any errors
//     console.log("Function error:", error.message);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "Internal server error", details: error.message })
//     };
//   }
// };


// Changed to use gemini-pro model instead of gemini-2.0-flash
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    // Get API key from environment variables
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured" })
      };
    }

    // Parse request body
    const { prompt } = JSON.parse(event.body || '{}');
    
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt parameter" })
      };
    }

    // CHANGED: Updated to use gemini-pro model instead of gemini-2.0-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    // Check for API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Gemini API error: ${response.status} - ${errorText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: `Gemini API error: ${response.status}`,
          details: errorText
        })
      };
    }

    // Process successful response
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response. Try again.";

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
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};