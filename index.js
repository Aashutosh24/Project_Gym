function scrollSlider(direction) {
  const slider = document.getElementById('slider');
  const scrollAmount = 700;

  slider.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
}

// Auto scroll every 4 seconds
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById('slider');

  setInterval(() => {
    // If at the end, scroll back to start
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      // Scroll right
      slider.scrollBy({ left: 700, behavior: 'smooth' });
    }
  }, 4000);
});


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
    const cardWidth = 500; // Approx width of one equi-card (including margin)
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollInterval;

    // 1. Drag-to-scroll
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        clearInterval(autoScrollInterval); // Pause auto-scroll on drag
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
        autoScrollInterval = startAutoScroll(); // Resume auto-scroll
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // scroll speed
        slider.scrollLeft = scrollLeft - walk;
    });

    // 2. Manual button scroll
    window.scrollSlider = function(direction) {
        clearInterval(autoScrollInterval); // pause
        slider.scrollBy({
            left: direction * cardWidth,
            behavior: 'smooth'
        });
        autoScrollInterval = startAutoScroll(); // resume
    };

    // 3. Auto-scroll every 4s
    function startAutoScroll() {
        return setInterval(() => {
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }, 4000);
    }

    autoScrollInterval = startAutoScroll(); // kick off
});
window.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');
  const dots = document.querySelectorAll('.dot');
  const cardWidth = slider.querySelector('.equi-card').offsetWidth + 20; // card + gap
  let currentIndex = 0;
  let autoScrollInterval;

  // Scroll to a specific slide
  window.goToSlide = function (index) {
    currentIndex = index;
    slider.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    updateDots();
    restartAutoScroll();
  };

  // Scroll using arrows
  window.scrollSlider = function (direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = dots.length - 1;
    if (currentIndex >= dots.length) currentIndex = 0;
    slider.scrollTo({ left: currentIndex * cardWidth, behavior: 'smooth' });
    updateDots();
    restartAutoScroll();
  };

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function autoScroll() {
    currentIndex = (currentIndex + 1) % dots.length;
    slider.scrollTo({ left: currentIndex * cardWidth, behavior: 'smooth' });
    updateDots();
  }

  function restartAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(autoScroll, 3000);
  }

  restartAutoScroll(); // Start initially
});