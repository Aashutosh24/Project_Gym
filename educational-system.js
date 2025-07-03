// Educational Content and Meal Planning System
class EducationalSystem {
    constructor() {
        this.fitnessBasics = {
            bmi: {
                title: "Understanding BMI",
                content: "Body Mass Index (BMI) is a measure of body fat based on height and weight. While useful as a screening tool, it doesn't account for muscle mass or body composition."
            },
            bmr: {
                title: "Basal Metabolic Rate (BMR)",
                content: "BMR is the number of calories your body needs to maintain basic functions at rest. It accounts for 60-70% of your total daily calorie expenditure."
            },
            tdee: {
                title: "Total Daily Energy Expenditure (TDEE)",
                content: "TDEE is your BMR plus calories burned through physical activity. It's your total daily calorie needs for weight maintenance."
            },
            macros: {
                title: "Macronutrients",
                content: "Protein builds muscle, carbohydrates provide energy, and fats support hormone production. Balance is key for optimal health."
            },
            progressiveOverload: {
                title: "Progressive Overload",
                content: "Gradually increasing the weight, frequency, or number of repetitions in your training to challenge your muscles and promote growth."
            }
        };

        this.mealPlanning = {
            templates: {
                lose_weight: {
                    breakfast: ["Protein oatmeal", "Greek yogurt with berries", "Vegetable omelet"],
                    lunch: ["Grilled chicken salad", "Turkey wrap with vegetables", "Quinoa bowl"],
                    dinner: ["Baked fish with vegetables", "Lean beef stir-fry", "Tofu and vegetable curry"],
                    snacks: ["Apple with almond butter", "Protein smoothie", "Hummus with vegetables"]
                },
                gain_muscle: {
                    breakfast: ["Protein pancakes", "Scrambled eggs with toast", "Smoothie bowl"],
                    lunch: ["Chicken and rice", "Salmon with sweet potato", "Pasta with lean meat"],
                    dinner: ["Steak with quinoa", "Fish with brown rice", "Chicken thighs with vegetables"],
                    snacks: ["Protein bar", "Nuts and fruit", "Chocolate milk"]
                },
                maintain_weight: {
                    breakfast: ["Balanced cereal", "Whole grain toast with avocado", "Fruit and yogurt"],
                    lunch: ["Balanced wrap", "Soup with whole grain bread", "Mixed green salad"],
                    dinner: ["Balanced plate", "Stir-fry with brown rice", "Grilled protein with vegetables"],
                    snacks: ["Mixed nuts", "Fruit", "Vegetable sticks"]
                }
            }
        };

        this.workoutBasics = {
            beginner: {
                title: "Beginner Workout Principles",
                content: "Start with 2-3 days per week, focus on form over weight, and allow rest days for recovery."
            },
            intermediate: {
                title: "Intermediate Training",
                content: "Increase training frequency to 4-5 days, add variation, and focus on progressive overload."
            },
            advanced: {
                title: "Advanced Training",
                content: "Utilize periodization, specialized techniques, and fine-tune your program for specific goals."
            }
        };
    }

    // Get educational content based on user profile
    getEducationalContent(userInput, analysis) {
        const content = [];
        
        // BMI education
        if (analysis.bmi < 18.5 || analysis.bmi > 25) {
            content.push({
                type: 'info',
                title: this.fitnessBasics.bmi.title,
                content: this.fitnessBasics.bmi.content + 
                        ` Your BMI of ${analysis.bmi} suggests you may benefit from professional guidance.`
            });
        }

        // BMR education
        content.push({
            type: 'info',
            title: this.fitnessBasics.bmr.title,
            content: this.fitnessBasics.bmr.content + 
                    ` Your BMR is ${analysis.bmr} calories per day.`
        });

        // Goal-specific education
        if (userInput.goal === 'lose_weight') {
            content.push({
                type: 'tip',
                title: "Weight Loss Tips",
                content: "Create a moderate calorie deficit (500 calories/day for 1 lb/week), focus on protein to preserve muscle, and combine cardio with strength training."
            });
        } else if (userInput.goal === 'gain_muscle') {
            content.push({
                type: 'tip',
                title: "Muscle Building Tips",
                content: "Maintain a slight calorie surplus, eat adequate protein (0.8-1g per lb bodyweight), and prioritize compound movements in your workouts."
            });
        }

        // Activity level education
        if (userInput.activityLevel === 'sedentary') {
            content.push({
                type: 'warning',
                title: "Sedentary Lifestyle Concerns",
                content: "Start slowly with 10-15 minutes of activity daily. Even light walking can provide significant health benefits."
            });
        }

        return content;
    }

    // Generate meal plan based on user's goal and preferences
    generateMealPlan(userInput, analysis) {
        const goal = userInput.goal;
        const templates = this.mealPlanning.templates[goal] || this.mealPlanning.templates.maintain_weight;
        
        const mealPlan = {
            dailyCalories: analysis.calorieTarget,
            macros: analysis.macros,
            meals: {
                breakfast: {
                    calories: Math.round(analysis.calorieTarget * 0.25),
                    options: templates.breakfast
                },
                lunch: {
                    calories: Math.round(analysis.calorieTarget * 0.35),
                    options: templates.lunch
                },
                dinner: {
                    calories: Math.round(analysis.calorieTarget * 0.30),
                    options: templates.dinner
                },
                snacks: {
                    calories: Math.round(analysis.calorieTarget * 0.10),
                    options: templates.snacks
                }
            },
            tips: this.getMealPlanTips(userInput, analysis)
        };

        return mealPlan;
    }

    getMealPlanTips(userInput, analysis) {
        const tips = [];
        
        if (userInput.goal === 'lose_weight') {
            tips.push("Eat protein with every meal to help maintain muscle mass");
            tips.push("Fill half your plate with vegetables");
            tips.push("Drink water before meals to help with satiety");
        } else if (userInput.goal === 'gain_muscle') {
            tips.push("Eat every 3-4 hours to maintain energy levels");
            tips.push("Include post-workout protein within 30 minutes");
            tips.push("Don't skip meals, especially breakfast");
        }

        tips.push(`Drink ${analysis.waterIntake}ml of water daily`);
        tips.push("Prepare meals in advance for consistency");
        tips.push("Listen to your hunger cues and adjust portions as needed");

        return tips;
    }

    // Generate workout video recommendations
    getWorkoutVideoRecommendations(userInput) {
        const recommendations = [];
        
        if (userInput.goal === 'lose_weight') {
            recommendations.push({
                type: 'HIIT',
                title: "High-Intensity Interval Training",
                description: "Burn calories efficiently with short bursts of intense activity",
                duration: "15-30 minutes",
                frequency: "3-4 times per week"
            });
            recommendations.push({
                type: 'Cardio',
                title: "Low-Impact Cardio",
                description: "Sustainable cardio for fat burning",
                duration: "30-45 minutes",
                frequency: "4-5 times per week"
            });
        } else if (userInput.goal === 'gain_muscle') {
            recommendations.push({
                type: 'Strength',
                title: "Compound Movements",
                description: "Multi-joint exercises for maximum muscle activation",
                duration: "45-60 minutes",
                frequency: "3-4 times per week"
            });
            recommendations.push({
                type: 'Hypertrophy',
                title: "Muscle Building Workouts",
                description: "Higher rep ranges for muscle growth",
                duration: "60-75 minutes",
                frequency: "4-5 times per week"
            });
        }

        recommendations.push({
            type: 'Flexibility',
            title: "Stretching and Mobility",
            description: "Improve flexibility and prevent injury",
            duration: "15-20 minutes",
            frequency: "Daily"
        });

        return recommendations;
    }

    // Get nutrition facts for common foods
    getNutritionFacts() {
        return {
            proteins: {
                'Chicken breast (100g)': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
                'Salmon (100g)': { calories: 208, protein: 25, carbs: 0, fat: 12 },
                'Greek yogurt (100g)': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
                'Eggs (1 large)': { calories: 70, protein: 6, carbs: 0.6, fat: 5 }
            },
            carbs: {
                'Brown rice (100g cooked)': { calories: 123, protein: 2.6, carbs: 23, fat: 0.9 },
                'Oats (100g)': { calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
                'Sweet potato (100g)': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
                'Quinoa (100g cooked)': { calories: 120, protein: 4.4, carbs: 22, fat: 1.9 }
            },
            fats: {
                'Avocado (100g)': { calories: 160, protein: 2, carbs: 9, fat: 15 },
                'Almonds (100g)': { calories: 579, protein: 21, carbs: 22, fat: 50 },
                'Olive oil (1 tbsp)': { calories: 119, protein: 0, carbs: 0, fat: 13.5 },
                'Peanut butter (2 tbsp)': { calories: 188, protein: 8, carbs: 8, fat: 16 }
            }
        };
    }

    // Generate educational content string
    formatEducationalContent(content) {
        let formatted = "## 📚 Educational Content\n\n";
        
        content.forEach(item => {
            const icon = item.type === 'tip' ? '💡' : 
                        item.type === 'warning' ? '⚠️' : 'ℹ️';
            formatted += `### ${icon} ${item.title}\n${item.content}\n\n`;
        });
        
        return formatted;
    }

    // Format meal plan
    formatMealPlan(mealPlan) {
        let formatted = "## 🍽️ Personalized Meal Plan\n\n";
        formatted += `**Daily Target:** ${mealPlan.dailyCalories} calories\n\n`;
        
        Object.entries(mealPlan.meals).forEach(([mealType, meal]) => {
            formatted += `### ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} (${meal.calories} calories)\n`;
            meal.options.forEach(option => {
                formatted += `• ${option}\n`;
            });
            formatted += '\n';
        });
        
        formatted += "### 💡 Meal Planning Tips\n";
        mealPlan.tips.forEach(tip => {
            formatted += `• ${tip}\n`;
        });
        
        return formatted + '\n';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EducationalSystem;
}