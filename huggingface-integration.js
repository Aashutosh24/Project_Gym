// Enhanced Hugging Face Integration for Fitness Recommendations
// This uses the free Hugging Face Inference API without requiring API keys

class HuggingFaceIntegration {
    constructor() {
        this.baseUrl = 'https://api-inference.huggingface.co/models';
        this.models = {
            textGeneration: 'microsoft/DialoGPT-large',
            healthQA: 'deepset/roberta-base-squad2',
            nutritionNER: 'Dizex/InstaFoodRoBERTa-NER'
        };
    }

    // Generate fitness recommendations using text generation
    async generateFitnessRecommendation(userInput, analysis) {
        const prompt = this.createFitnessPrompt(userInput, analysis);
        
        try {
            const response = await fetch(`${this.baseUrl}/${this.models.textGeneration}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 500,
                        temperature: 0.7,
                        do_sample: true,
                        return_full_text: false
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle different response formats
            if (Array.isArray(data)) {
                return data[0]?.generated_text || data[0]?.text || null;
            } else if (data.generated_text) {
                return data.generated_text;
            } else if (data.text) {
                return data.text;
            }
            
            return null;
        } catch (error) {
            console.error('Hugging Face API error:', error);
            return null;
        }
    }

    // Create a structured prompt for fitness recommendations
    createFitnessPrompt(userInput, analysis) {
        const { height, weight, age, gender, goal, activityLevel, healthConditions } = userInput;
        
        return `As a fitness expert, provide personalized recommendations for:
        
Profile: ${age}-year-old ${gender}, ${height}cm tall, ${weight}kg
Goal: ${goal.replace('_', ' ')}
Activity: ${activityLevel}
Health: ${healthConditions || 'No specific conditions'}

Current Analysis:
- BMI: ${analysis.bmi} (${analysis.bmiCategory.category})
- Daily Calories: ${analysis.calorieTarget}
- Macros: ${analysis.macros.protein}g protein, ${analysis.macros.carbs}g carbs, ${analysis.macros.fat}g fat

Provide specific workout and nutrition advice:

Workout Plan:
- Exercise types and frequency
- Sets, reps, and progression
- Safety considerations

Nutrition Strategy:
- Meal timing and portions
- Food recommendations
- Hydration goals

Weekly Schedule:
- Day-by-day activity plan
- Rest and recovery

Expected Results:
- Timeline for seeing changes
- Realistic expectations

Remember to be specific and actionable.`;
    }

    // Alternative: Use a more fitness-focused approach with multiple API calls
    async generateComprehensiveRecommendation(userInput, analysis) {
        const workoutPlan = await this.generateWorkoutPlan(userInput, analysis);
        const nutritionPlan = await this.generateNutritionPlan(userInput, analysis);
        
        return this.combineRecommendations(workoutPlan, nutritionPlan, userInput, analysis);
    }

    async generateWorkoutPlan(userInput, analysis) {
        const { goal, activityLevel, age, healthConditions } = userInput;
        
        const workoutPrompt = `Create a workout plan for ${goal.replace('_', ' ')} goal:
        
Current fitness level: ${activityLevel}
Age: ${age}
Health considerations: ${healthConditions || 'None'}

Provide:
1. Weekly schedule (days per week)
2. Specific exercises with sets and reps
3. Progression plan
4. Safety tips

Focus on practical, equipment-flexible exercises.`;

        try {
            const response = await fetch(`${this.baseUrl}/${this.models.textGeneration}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: workoutPrompt,
                    parameters: {
                        max_new_tokens: 300,
                        temperature: 0.6,
                        do_sample: true
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                return Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
            }
        } catch (error) {
            console.error('Workout plan generation error:', error);
        }
        
        return null;
    }

    async generateNutritionPlan(userInput, analysis) {
        const { goal, weight, height } = userInput;
        const { calorieTarget, macros } = analysis;
        
        const nutritionPrompt = `Create a nutrition plan for ${goal.replace('_', ' ')}:
        
Daily calories: ${calorieTarget}
Macros: ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat
Weight: ${weight}kg, Height: ${height}cm

Provide:
1. Meal timing (breakfast, lunch, dinner, snacks)
2. Food recommendations for each macro
3. Portion sizes and meal prep tips
4. Hydration guidelines

Focus on practical, accessible foods.`;

        try {
            const response = await fetch(`${this.baseUrl}/${this.models.textGeneration}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: nutritionPrompt,
                    parameters: {
                        max_new_tokens: 300,
                        temperature: 0.6,
                        do_sample: true
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                return Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
            }
        } catch (error) {
            console.error('Nutrition plan generation error:', error);
        }
        
        return null;
    }

    combineRecommendations(workoutPlan, nutritionPlan, userInput, analysis) {
        const { goal, age, gender } = userInput;
        
        let combined = `# 🏋️ Personalized Fitness Recommendation\n\n`;
        combined += `**Profile:** ${age}-year-old ${gender}\n`;
        combined += `**Goal:** ${goal.replace('_', ' ').toUpperCase()}\n`;
        combined += `**BMI:** ${analysis.bmi} (${analysis.bmiCategory.category})\n\n`;
        
        if (workoutPlan) {
            combined += `## 💪 Workout Plan\n${workoutPlan}\n\n`;
        }
        
        if (nutritionPlan) {
            combined += `## 🥗 Nutrition Plan\n${nutritionPlan}\n\n`;
        }
        
        combined += `## 📊 Your Daily Targets\n`;
        combined += `• Calories: ${analysis.calorieTarget}\n`;
        combined += `• Protein: ${analysis.macros.protein}g\n`;
        combined += `• Carbs: ${analysis.macros.carbs}g\n`;
        combined += `• Fats: ${analysis.macros.fat}g\n`;
        combined += `• Water: ${analysis.waterIntake}ml\n\n`;
        
        combined += `## 🎯 Quick Tips\n`;
        combined += `• Track your progress weekly\n`;
        combined += `• Stay consistent with your plan\n`;
        combined += `• Listen to your body and rest when needed\n`;
        combined += `• Adjust portions based on hunger and energy\n\n`;
        
        if (analysis.bmi < 18.5 || analysis.bmi > 30) {
            combined += `## ⚠️ Health Notice\n`;
            combined += `Consider consulting a healthcare provider before starting any new fitness program.\n\n`;
        }
        
        return combined;
    }

    // Check if Hugging Face API is available
    async checkAvailability() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.models.textGeneration}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: 'Hello',
                    parameters: {
                        max_new_tokens: 10
                    }
                })
            });
            
            return response.ok;
        } catch (error) {
            console.error('Hugging Face availability check failed:', error);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HuggingFaceIntegration;
}