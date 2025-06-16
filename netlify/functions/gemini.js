async function askGemini() {
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const goal = document.getElementById("goal").value;
  
    if (!height || !weight || !goal) {
      alert("Please fill all fields");
      return;
    }
  
    const prompt = `I am ${height} cm tall and weigh ${weight} kg. My goal is to ${goal}. Suggest a workout and diet plan.`;
  
    const responseBox = document.getElementById("response");
    responseBox.innerText = "Thinking...";
  
    try {
      const result = await fetch("/.netlify/functions/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
  
      const data = await result.json();
      const reply = data?.reply || "No response. Try again.";
      responseBox.innerText = reply;
    } catch (error) {
      responseBox.innerText = "Error contacting AI.";
      console.error("AI Error:", error);
    }
  }
  