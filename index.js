// Initialize fitness calculator and AI providers
const fitnessCalculator = new FitnessCalculator();
const aiProvidersManager = new AIProvidersManager();
const educationalSystem = new EducationalSystem();

// Unit system toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const unitSystemRadios = document.querySelectorAll('input[name="unitSystem"]');
    const heightInputMetric = document.getElementById('heightInputMetric');
    const heightInputImperial = document.getElementById('heightInputImperial');
    const weightInput = document.getElementById('weight');

    unitSystemRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'metric') {
                heightInputMetric.style.display = 'block';
                heightInputImperial.style.display = 'none';
                weightInput.placeholder = 'Weight (kg)';
                fitnessCalculator.unitSystem = 'metric';
            } else {
                heightInputMetric.style.display = 'none';
                heightInputImperial.style.display = 'block';
                weightInput.placeholder = 'Weight (lbs)';
                fitnessCalculator.unitSystem = 'imperial';
            }
        });
    });
});

// Close AI Modal
function closeAIModal() {
    document.getElementById('aiModal').style.display = 'none';
}

// Gather user input from form
function gatherUserInput() {
    const unitSystem = document.querySelector('input[name="unitSystem"]:checked').value;
    let height, weight;

    if (unitSystem === 'metric') {
        height = parseFloat(document.getElementById('height').value);
        weight = parseFloat(document.getElementById('weight').value);
    } else {
        const feet = parseFloat(document.getElementById('heightFeet').value);
        const inches = parseFloat(document.getElementById('heightInches').value);
        height = fitnessCalculator.convertHeightToCm(feet, inches);
        weight = fitnessCalculator.convertWeightToKg(parseFloat(document.getElementById('weight').value));
    }

    return {
        height,
        weight,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        activityLevel: document.getElementById('activityLevel').value,
        goal: document.getElementById('goal').value,
        healthConditions: document.getElementById('healthConditions').value.trim()
    };
}

// Validate user input
function validateUserInput(userInput) {
    const errors = [];
    
    if (!userInput.height || userInput.height <= 0) errors.push('Height is required');
    if (!userInput.weight || userInput.weight <= 0) errors.push('Weight is required');
    if (!userInput.age || userInput.age < 13 || userInput.age > 100) errors.push('Age must be between 13-100');
    if (!userInput.gender) errors.push('Gender is required');
    if (!userInput.activityLevel) errors.push('Activity level is required');
    if (!userInput.goal) errors.push('Fitness goal is required');
    
    return errors;
}

// Calculate basic metrics (BMI, BMR, etc.)
function calculateBasics() {
    try {
        const userInput = gatherUserInput();
        const errors = validateUserInput(userInput);
        
        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return;
        }

        const analysis = fitnessCalculator.generateAnalysis(userInput);
        displayQuickResults(analysis);
        document.getElementById('progressSection').style.display = 'block';
        
    } catch (error) {
        console.error('Error calculating basics:', error);
        alert('Error calculating metrics. Please check your input.');
    }
}

// Display quick results
function displayQuickResults(analysis) {
    const quickResults = document.getElementById('quickResults');
    const content = document.getElementById('quickResultsContent');
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            <div><strong>BMI:</strong> ${analysis.bmi}</div>
            <div><strong>Category:</strong> <span style="color: ${analysis.bmiCategory.color};">${analysis.bmiCategory.category}</span></div>
            <div><strong>BMR:</strong> ${analysis.bmr} cal/day</div>
            <div><strong>TDEE:</strong> ${analysis.tdee} cal/day</div>
            <div><strong>Target:</strong> ${analysis.calorieTarget} cal/day</div>
            <div><strong>Body Fat:</strong> ~${analysis.bodyFat}%</div>
            <div><strong>Protein:</strong> ${analysis.macros.protein}g</div>
            <div><strong>Carbs:</strong> ${analysis.macros.carbs}g</div>
            <div><strong>Fats:</strong> ${analysis.macros.fat}g</div>
            <div><strong>Water:</strong> ${analysis.waterIntake}ml/day</div>
        </div>
        <div style="margin-top: 10px; padding: 10px; background: ${analysis.bmiCategory.color}22; border-radius: 4px; font-size: 12px;">
            <strong>Macronutrient Distribution:</strong> ${analysis.macros.proteinPercent}% protein, ${analysis.macros.carbsPercent}% carbs, ${analysis.macros.fatPercent}% fat
        </div>
    `;
    
    quickResults.style.display = 'block';
}

// Get AI recommendation
async function getAIRecommendation() {
    try {
        const userInput = gatherUserInput();
        const errors = validateUserInput(userInput);
        
        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return;
        }

        const responseBox = document.getElementById('response');
        responseBox.innerHTML = '🤖 AI is analyzing your profile and generating personalized recommendations...<br><br>This may take a moment.';
        
        // Calculate analysis
        const analysis = fitnessCalculator.generateAnalysis(userInput);
        displayQuickResults(analysis);
        
        // Get educational content
        const educationalContent = educationalSystem.getEducationalContent(userInput, analysis);
        const mealPlan = educationalSystem.generateMealPlan(userInput, analysis);
        const workoutRecommendations = educationalSystem.getWorkoutVideoRecommendations(userInput);
        
        // Get AI recommendation
        const recommendation = await aiProvidersManager.getRecommendation(userInput, analysis);
        
        // Display comprehensive recommendation
        let fullRecommendation = recommendation.data;
        fullRecommendation += '\n\n' + educationalSystem.formatEducationalContent(educationalContent);
        fullRecommendation += '\n\n' + educationalSystem.formatMealPlan(mealPlan);
        
        // Add workout video recommendations
        fullRecommendation += '\n\n## 🎥 Recommended Workout Types\n\n';
        workoutRecommendations.forEach(workout => {
            fullRecommendation += `### ${workout.type}: ${workout.title}\n`;
            fullRecommendation += `${workout.description}\n`;
            fullRecommendation += `Duration: ${workout.duration}, Frequency: ${workout.frequency}\n\n`;
        });
        
        // Display recommendation
        responseBox.innerHTML = `
            <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                Generated by: ${recommendation.source.toUpperCase()}
            </div>
            <div style="white-space: pre-wrap; line-height: 1.5;">
                ${fullRecommendation}
            </div>
        `;
        
        // Show progress section
        document.getElementById('progressSection').style.display = 'block';
        
    } catch (error) {
        console.error('Error getting AI recommendation:', error);
        document.getElementById('response').innerHTML = 'Error getting recommendation. Please try again.';
    }
}

// Save progress data
function saveProgress() {
    try {
        const userInput = gatherUserInput();
        const analysis = fitnessCalculator.generateAnalysis(userInput);
        
        const progressData = {
            date: new Date().toISOString(),
            userInput,
            analysis,
            timestamp: Date.now()
        };
        
        // Get existing progress
        let progressHistory = JSON.parse(localStorage.getItem('fitnessProgress') || '[]');
        progressHistory.push(progressData);
        
        // Keep only last 50 entries
        if (progressHistory.length > 50) {
            progressHistory = progressHistory.slice(-50);
        }
        
        localStorage.setItem('fitnessProgress', JSON.stringify(progressHistory));
        alert('Progress saved successfully!');
        
    } catch (error) {
        console.error('Error saving progress:', error);
        alert('Error saving progress. Please try again.');
    }
}

// View progress history
function viewProgress() {
    try {
        const progressHistory = JSON.parse(localStorage.getItem('fitnessProgress') || '[]');
        
        if (progressHistory.length === 0) {
            alert('No progress data saved yet. Use "Save Current Data" first.');
            return;
        }
        
        const responseBox = document.getElementById('response');
        let progressHTML = '<h4>📈 Your Progress History</h4>';
        
        progressHistory.slice(-10).reverse().forEach((entry, index) => {
            const date = new Date(entry.date).toLocaleDateString();
            progressHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 4px;">
                    <strong>${date}</strong><br>
                    Weight: ${entry.userInput.weight}kg, BMI: ${entry.analysis.bmi}, 
                    Goal: ${entry.userInput.goal.replace('_', ' ')}
                </div>
            `;
        });
        
        responseBox.innerHTML = progressHTML;
        
    } catch (error) {
        console.error('Error viewing progress:', error);
        alert('Error loading progress data.');
    }
}

// Show nutrition facts database
function showNutritionFacts() {
    const nutritionFacts = educationalSystem.getNutritionFacts();
    const responseBox = document.getElementById('response');
    
    let nutritionHTML = '<h3>📊 Nutrition Facts Database</h3>';
    
    Object.entries(nutritionFacts).forEach(([category, foods]) => {
        nutritionHTML += `<h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>`;
        nutritionHTML += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">';
        
        Object.entries(foods).forEach(([food, nutrition]) => {
            nutritionHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px; font-size: 12px;">
                    <strong>${food}</strong><br>
                    Calories: ${nutrition.calories}<br>
                    Protein: ${nutrition.protein}g<br>
                    Carbs: ${nutrition.carbs}g<br>
                    Fat: ${nutrition.fat}g
                </div>
            `;
        });
        
        nutritionHTML += '</div>';
    });
    
    responseBox.innerHTML = nutritionHTML;
}

// Generate meal plan
function generateMealPlan() {
    try {
        const userInput = gatherUserInput();
        const errors = validateUserInput(userInput);
        
        if (errors.length > 0) {
            alert('Please complete the form first to generate a meal plan.');
            return;
        }
        
        const analysis = fitnessCalculator.generateAnalysis(userInput);
        const mealPlan = educationalSystem.generateMealPlan(userInput, analysis);
        
        document.getElementById('response').innerHTML = educationalSystem.formatMealPlan(mealPlan);
        
    } catch (error) {
        console.error('Error generating meal plan:', error);
        document.getElementById('response').innerHTML = 'Error generating meal plan. Please check your input.';
    }
}

// Show workout video recommendations
function showWorkoutVideos() {
    try {
        const userInput = gatherUserInput();
        const errors = validateUserInput(userInput);
        
        if (errors.length > 0) {
            alert('Please complete the form first to get workout recommendations.');
            return;
        }
        
        const workoutRecommendations = educationalSystem.getWorkoutVideoRecommendations(userInput);
        
        let workoutHTML = '<h3>🎥 Recommended Workout Types</h3>';
        
        workoutRecommendations.forEach(workout => {
            workoutHTML += `
                <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 4px;">
                    <h4>${workout.type}: ${workout.title}</h4>
                    <p>${workout.description}</p>
                    <div style="display: flex; gap: 20px; font-size: 14px; color: #666;">
                        <span><strong>Duration:</strong> ${workout.duration}</span>
                        <span><strong>Frequency:</strong> ${workout.frequency}</span>
                    </div>
                </div>
            `;
        });
        
        workoutHTML += `
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 4px;">
                <h4>💡 Tips for Finding Workout Videos</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Search for your specific workout type on YouTube or fitness apps</li>
                    <li>Start with beginner-friendly videos and progress gradually</li>
                    <li>Look for certified trainers with good form demonstrations</li>
                    <li>Follow along with full-length workouts for structure</li>
                    <li>Mix different instructors to prevent boredom</li>
                </ul>
            </div>
        `;
        
        document.getElementById('response').innerHTML = workoutHTML;
        
    } catch (error) {
        console.error('Error showing workout videos:', error);
        document.getElementById('response').innerHTML = 'Error loading workout recommendations.';
    }
}

// Legacy function for backwards compatibility
async function askGemini() {
    await getAIRecommendation();
}

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
    // Legacy function - redirect to new system
    await getAIRecommendation();
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
