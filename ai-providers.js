// AI Providers Manager - Handles multiple AI services with fallback
class AIProvidersManager {
    constructor() {
        this.providers = [
            { name: 'gemini', enabled: true, priority: 1 },
            { name: 'huggingface', enabled: true, priority: 2 },
            { name: 'fallback', enabled: true, priority: 3 }
        ];
        this.cache = new Map();
        this.rateLimitCache = new Map();
        this.huggingFaceIntegration = new HuggingFaceIntegration();
    }

    // Check rate limiting
    checkRateLimit(provider) {
        const key = `${provider}_${Date.now()}`;
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute window
        const maxRequests = provider === 'gemini' ? 60 : 30; // Different limits per provider

        // Clean old entries
        for (const [k, v] of this.rateLimitCache.entries()) {
            if (now - v.timestamp > windowMs) {
                this.rateLimitCache.delete(k);
            }
        }

        // Count requests in current window
        const recentRequests = Array.from(this.rateLimitCache.values())
            .filter(entry => entry.provider === provider && now - entry.timestamp < windowMs);

        if (recentRequests.length >= maxRequests) {
            return false;
        }

        // Record this request
        this.rateLimitCache.set(key, { provider, timestamp: now });
        return true;
    }

    // Generate cache key
    generateCacheKey(userInput) {
        return `${userInput.height}_${userInput.weight}_${userInput.age}_${userInput.gender}_${userInput.goal}_${userInput.activityLevel}`;
    }

    // Check cache
    checkCache(userInput) {
        const key = this.generateCacheKey(userInput);
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) { // 30 minutes cache
            return cached.data;
        }
        return null;
    }

    // Store in cache
    storeInCache(userInput, data) {
        const key = this.generateCacheKey(userInput);
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    // Call Gemini API
    async callGeminiAPI(prompt) {
        try {
            const response = await fetch("/.netlify/functions/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            return data.reply || null;
        } catch (error) {
            console.error("Gemini API error:", error);
            return null;
        }
    }

    // Call Hugging Face API (free inference)
    async callHuggingFaceAPI(prompt, userInput, analysis) {
        try {
            return await this.huggingFaceIntegration.generateFitnessRecommendation(userInput, analysis);
        } catch (error) {
            console.error("Hugging Face API error:", error);
            return null;
        }
    }

    // Rule-based fallback system
    generateFallbackRecommendation(userInput, analysis) {
        const { goal, activityLevel, age, gender } = userInput;
        const { bmi, bmiCategory, calorieTarget, macros } = analysis;

        let recommendation = `## Personalized Fitness Recommendation\n\n`;
        
        // Health status assessment
        recommendation += `### Health Assessment\n`;
        recommendation += `• BMI: ${analysis.bmi} (${bmiCategory.category})\n`;
        recommendation += `• Daily Calorie Target: ${calorieTarget} calories\n`;
        recommendation += `• Estimated Body Fat: ${analysis.bodyFat}%\n\n`;

        // Nutrition recommendations
        recommendation += `### Nutrition Plan\n`;
        recommendation += `• Protein: ${macros.protein}g (${macros.proteinPercent}%)\n`;
        recommendation += `• Carbohydrates: ${macros.carbs}g (${macros.carbsPercent}%)\n`;
        recommendation += `• Fats: ${macros.fat}g (${macros.fatPercent}%)\n`;
        recommendation += `• Water Intake: ${analysis.waterIntake}ml daily\n\n`;

        // Exercise recommendations based on goal
        recommendation += `### Exercise Program\n`;
        
        if (goal === 'lose_weight') {
            recommendation += `**Weight Loss Focus:**\n`;
            recommendation += `• Cardio: 4-5 times per week (30-45 minutes)\n`;
            recommendation += `• Strength training: 2-3 times per week\n`;
            recommendation += `• Walking: 10,000 steps daily\n`;
            recommendation += `• HIIT: 2 times per week (20-30 minutes)\n\n`;
        } else if (goal === 'gain_muscle') {
            recommendation += `**Muscle Building Focus:**\n`;
            recommendation += `• Strength training: 4-5 times per week\n`;
            recommendation += `• Compound exercises: Squats, deadlifts, bench press\n`;
            recommendation += `• Progressive overload: Increase weight/reps weekly\n`;
            recommendation += `• Rest days: 2-3 per week for recovery\n\n`;
        } else if (goal === 'maintain_weight') {
            recommendation += `**Maintenance Focus:**\n`;
            recommendation += `• Balanced routine: 3-4 workouts per week\n`;
            recommendation += `• Mix of cardio and strength training\n`;
            recommendation += `• Flexibility and mobility work\n`;
            recommendation += `• Consistent activity level\n\n`;
        } else {
            recommendation += `**General Fitness:**\n`;
            recommendation += `• Full-body workouts: 3 times per week\n`;
            recommendation += `• Cardio: 2-3 times per week\n`;
            recommendation += `• Flexibility training: Daily\n`;
            recommendation += `• Active recovery: Walking, swimming\n\n`;
        }

        // Lifestyle recommendations
        recommendation += `### Lifestyle Guidelines\n`;
        recommendation += `• Sleep: ${analysis.sleepHours} hours per night\n`;
        recommendation += `• Meal frequency: 4-6 smaller meals daily\n`;
        recommendation += `• Stress management: Meditation, yoga\n`;
        recommendation += `• Progress tracking: Weekly weigh-ins and measurements\n\n`;

        // Safety considerations
        if (bmi < 18.5 || bmi > 30) {
            recommendation += `### ⚠️ Health Notice\n`;
            recommendation += `Your BMI indicates you should consult with a healthcare provider before starting any new fitness program.\n\n`;
        }

        if (age > 65) {
            recommendation += `### Senior Fitness Considerations\n`;
            recommendation += `• Focus on balance and flexibility\n`;
            recommendation += `• Low-impact exercises\n`;
            recommendation += `• Gradual progression\n`;
            recommendation += `• Regular health checkups\n\n`;
        }

        return recommendation;
    }

    // Generate enhanced prompt for AI providers
    generateEnhancedPrompt(userInput, analysis) {
        const { height, weight, age, gender, goal, activityLevel, healthConditions } = userInput;
        
        return `You are a certified fitness and nutrition expert. Please provide a comprehensive, personalized fitness recommendation for this person:

**Profile:**
- Height: ${height}cm, Weight: ${weight}kg, Age: ${age}, Gender: ${gender}
- Activity Level: ${activityLevel}
- Primary Goal: ${goal}
- Health Conditions: ${healthConditions || 'None specified'}

**Calculated Metrics:**
- BMI: ${analysis.bmi} (${analysis.bmiCategory.category})
- BMR: ${analysis.bmr} calories/day
- TDEE: ${analysis.tdee} calories/day
- Target Calories: ${analysis.calorieTarget} calories/day
- Macros: ${analysis.macros.protein}g protein, ${analysis.macros.carbs}g carbs, ${analysis.macros.fat}g fat

Please provide:
1. **Workout Plan**: Specific exercises, sets, reps, and weekly schedule
2. **Nutrition Strategy**: Meal timing, food choices, and portion sizes
3. **Progression Plan**: How to advance over 4-12 weeks
4. **Safety Considerations**: Any precautions or modifications needed
5. **Lifestyle Tips**: Sleep, stress management, and recovery

Make it actionable, evidence-based, and personalized. Format with clear headings and bullet points.`;
    }

    // Main method to get AI recommendation
    async getRecommendation(userInput, analysis) {
        // Check cache first
        const cached = this.checkCache(userInput);
        if (cached) {
            return { source: 'cache', data: cached };
        }

        const prompt = this.generateEnhancedPrompt(userInput, analysis);
        
        // Try providers in order of priority
        for (const provider of this.providers.sort((a, b) => a.priority - b.priority)) {
            if (!provider.enabled) continue;

            // Check rate limiting
            if (!this.checkRateLimit(provider.name)) {
                console.log(`Rate limit exceeded for ${provider.name}`);
                continue;
            }

            try {
                let result = null;
                
                switch (provider.name) {
                    case 'gemini':
                        result = await this.callGeminiAPI(prompt);
                        break;
                    case 'huggingface':
                        result = await this.callHuggingFaceAPI(prompt, userInput, analysis);
                        break;
                    case 'fallback':
                        result = this.generateFallbackRecommendation(userInput, analysis);
                        break;
                }

                if (result) {
                    // Store in cache
                    this.storeInCache(userInput, result);
                    return { source: provider.name, data: result };
                }
            } catch (error) {
                console.error(`Error with ${provider.name}:`, error);
                continue;
            }
        }

        // If all providers fail, return fallback
        const fallbackResult = this.generateFallbackRecommendation(userInput, analysis);
        this.storeInCache(userInput, fallbackResult);
        return { source: 'fallback', data: fallbackResult };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIProvidersManager;
}