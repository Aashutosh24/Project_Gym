// // netlify/functions/gemini.js

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

import fetch from 'node-fetch';

const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const { prompt } = JSON.parse(event.body);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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

  const data = await response.json();

  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response. Try again.";

  return {
    statusCode: 200,
    body: JSON.stringify({ reply })
  };
};
