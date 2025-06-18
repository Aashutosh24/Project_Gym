document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".tomember").addEventListener("click", function () {
        const section = document.getElementById("membership");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    });

    document.getElementById("aiBtn").onclick = () => {
        const modal = document.getElementById("aiModal");
        modal.style.display = modal.style.display === "none" ? "block" : "none";
    };
});

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


window.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    // Drag scroll
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Auto scroll
    const cardWidth = 500; // includes margin/gap
    function scrollSlider(direction) {
        slider.scrollBy({
            left: direction * cardWidth,
            behavior: 'smooth'
        });
    }

    // Auto scroll with loop
    setInterval(() => {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
            // End reached, go back to start
            slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollSlider(1);
        }
    }, 4000); // scroll every 4s
});

