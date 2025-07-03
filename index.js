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

async function askClaude() {
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const goal = document.getElementById("goal").value;
    const age = document.getElementById("age").value;
    const activityLevel = document.getElementById("activityLevel").value;

    // Validate required fields
    if (!height || !weight || !goal) {
        showError("Please fill in all required fields: Height, Weight, and Fitness Goal");
        return;
    }

    // Validate height and weight ranges
    if (height < 100 || height > 250) {
        showError("Please enter a valid height between 100-250 cm");
        return;
    }

    if (weight < 20 || weight > 300) {
        showError("Please enter a valid weight between 20-300 kg");
        return;
    }

    if (age && (age < 13 || age > 100)) {
        showError("Please enter a valid age between 13-100 years");
        return;
    }

    const responseBox = document.getElementById("response");
    const responseActions = document.getElementById("responseActions");
    const askButton = document.getElementById("askButton");
    
    // Show loading state
    responseBox.style.display = "block";
    responseBox.innerHTML = `
        <div style="text-align: center; color: #666;">
            <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #00ccff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p>Analyzing your profile and generating personalized recommendations...</p>
        </div>
    `;
    responseActions.style.display = "none";
    askButton.disabled = true;
    askButton.style.opacity = "0.6";

    try {
        const result = await fetch("/.netlify/functions/claude", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                height: parseInt(height),
                weight: parseInt(weight),
                goal,
                age: age ? parseInt(age) : null,
                activityLevel: activityLevel || null
            })
        });

        const data = await result.json();
        
        if (!result.ok) {
            throw new Error(data.error || "Failed to get recommendations");
        }

        const reply = data?.reply || "No response received. Please try again.";
        
        // Format and display the response
        responseBox.innerHTML = formatResponse(reply);
        responseActions.style.display = "block";
        
        // Store response for save/print functionality
        window.lastRecommendations = {
            userProfile: { height, weight, goal, age, activityLevel },
            recommendations: reply,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error("Claude API Error:", error);
        responseBox.innerHTML = `
            <div style="color: #dc3545; text-align: center; padding: 10px;">
                <strong>❌ Error:</strong> ${error.message || "Unable to get recommendations. Please try again."}
            </div>
        `;
        responseActions.style.display = "none";
    } finally {
        askButton.disabled = false;
        askButton.style.opacity = "1";
    }
}

function formatResponse(text) {
    // Add basic formatting to make the response more readable
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/🎯|🥗|🏋️|💡/g, '<br><br>$&');
}

function showError(message) {
    const responseBox = document.getElementById("response");
    responseBox.style.display = "block";
    responseBox.innerHTML = `
        <div style="color: #dc3545; text-align: center; padding: 10px; border: 1px solid #f5c6cb; background-color: #f8d7da; border-radius: 4px;">
            <strong>⚠️ ${message}</strong>
        </div>
    `;
    setTimeout(() => {
        responseBox.style.display = "none";
    }, 5000);
}

function saveRecommendations() {
    if (!window.lastRecommendations) {
        alert("No recommendations to save!");
        return;
    }

    const dataStr = JSON.stringify(window.lastRecommendations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-recommendations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function printRecommendations() {
    if (!window.lastRecommendations) {
        alert("No recommendations to print!");
        return;
    }

    const printWindow = window.open('', '_blank');
    const { userProfile, recommendations, timestamp } = window.lastRecommendations;
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Fitness Recommendations - ${new Date(timestamp).toLocaleDateString()}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #00ccff; padding-bottom: 10px; }
                    .profile { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .recommendations { margin-top: 20px; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏋️ Personalized Fitness Recommendations</h1>
                    <p>Generated on ${new Date(timestamp).toLocaleString()}</p>
                </div>
                
                <div class="profile">
                    <h3>Your Profile:</h3>
                    <p><strong>Height:</strong> ${userProfile.height} cm</p>
                    <p><strong>Weight:</strong> ${userProfile.weight} kg</p>
                    <p><strong>Goal:</strong> ${userProfile.goal}</p>
                    ${userProfile.age ? `<p><strong>Age:</strong> ${userProfile.age} years</p>` : ''}
                    ${userProfile.activityLevel ? `<p><strong>Activity Level:</strong> ${userProfile.activityLevel}</p>` : ''}
                </div>
                
                <div class="recommendations">
                    <h3>Your Recommendations:</h3>
                    <div>${formatResponse(recommendations)}</div>
                </div>
                
                <div class="footer">
                    <p>Generated by Fitness Club AI Assistant | www.FitnessClub.com</p>
                </div>
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
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

window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('googleUser'));

    if (user) {
      // Hide login/signup
      document.getElementById('login').style.display = 'none';
      document.getElementById('sign').style.display = 'none';

      // Show profile
      const profileContainer = document.createElement('li');
      profileContainer.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${user.picture}" alt="Profile" style="width:30px; height:30px; border-radius:50%;">
          <span>${user.name}</span>
          <button onclick="logout()" style="margin-left:10px;">Logout</button>
        </div>
      `;

      document.querySelector('nav ul').appendChild(profileContainer);
    }
  });

  function logout() {
    localStorage.removeItem('googleUser');
    location.reload();
  }

  function handleCredentialResponse(response) {
  const token = response.credential;
  const payload = parseJwt(token);

  // Save in localStorage
  localStorage.setItem('googleUser', JSON.stringify({
    name: payload.name,
    email: payload.email,
    picture: payload.picture
  }));

  // Send to backend
  fetch('http://localhost:5000/api/save-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    })
  }).then(res => res.json())
    .then(data => console.log("User saved to DB:", data))
    .catch(err => console.error("Error saving user:", err));

  // Redirect
  window.location.href = "/index.html";
}
