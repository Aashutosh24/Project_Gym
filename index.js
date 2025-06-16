document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".tomember").addEventListener("click", function () {
        const section = document.getElementById("membership");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    });
});

const apiKey = process.env.GEMINI_API_KEY; 
// Toggle modal
document.getElementById("aiBtn").onclick = () => {
const modal = document.getElementById("aiModal");
modal.style.display = modal.style.display === "none" ? "block" : "none";
};

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

const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
})
});

const data = await result.json();
const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response. Try again.";
responseBox.innerText = reply;

}

const result = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    body: JSON.stringify({ prompt })
  });
  const data = await result.json();
  responseBox.innerText = data.reply;
  
