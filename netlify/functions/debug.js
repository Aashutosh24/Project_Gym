exports.handler = async function() {
  const apiKeyExists = !!process.env.GEMINI_API_KEY;
  const apiKeyFirstChars = apiKeyExists ? process.env.GEMINI_API_KEY.substring(0, 4) + "..." : "none";
  
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      envVarExists: apiKeyExists,
      envVarFirstChars: apiKeyFirstChars,
      allEnvVars: Object.keys(process.env).filter(key => !key.includes("AWS") && !key.includes("SECRET"))
    })
  };
};