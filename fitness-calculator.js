// Fitness Calculator - BMI, BMR, and recommendation algorithms
class FitnessCalculator {
    constructor() {
        this.unitSystem = 'metric'; // 'metric' or 'imperial'
    }

    // Convert height from feet-inches to cm
    convertHeightToCm(feet, inches) {
        return (feet * 12 + inches) * 2.54;
    }

    // Convert weight from lbs to kg
    convertWeightToKg(pounds) {
        return pounds * 0.453592;
    }

    // Calculate BMI
    calculateBMI(weight, height) {
        // weight in kg, height in cm
        const heightM = height / 100;
        return weight / (heightM * heightM);
    }

    // Get BMI category
    getBMICategory(bmi) {
        if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
        if (bmi < 25) return { category: 'Normal weight', color: '#2ecc71' };
        if (bmi < 30) return { category: 'Overweight', color: '#f39c12' };
        return { category: 'Obese', color: '#e74c3c' };
    }

    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    calculateBMR(weight, height, age, gender) {
        // weight in kg, height in cm, age in years
        if (gender === 'male') {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    calculateTDEE(bmr, activityLevel) {
        const multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };
        return bmr * multipliers[activityLevel];
    }

    // Calculate daily calorie target based on goal
    calculateCalorieTarget(tdee, goal) {
        switch (goal) {
            case 'lose_weight':
                return tdee - 500; // 500 calorie deficit for 1 lb/week loss
            case 'gain_muscle':
                return tdee + 300; // 300 calorie surplus for muscle gain
            case 'maintain_weight':
                return tdee;
            case 'general_fitness':
                return tdee;
            default:
                return tdee;
        }
    }

    // Calculate macronutrient distribution
    calculateMacros(calories, goal) {
        let protein, carbs, fat;
        
        switch (goal) {
            case 'lose_weight':
                // Higher protein for muscle retention
                protein = 0.35;
                carbs = 0.30;
                fat = 0.35;
                break;
            case 'gain_muscle':
                // Higher protein and carbs for muscle building
                protein = 0.30;
                carbs = 0.45;
                fat = 0.25;
                break;
            case 'maintain_weight':
            case 'general_fitness':
            default:
                // Balanced macros
                protein = 0.25;
                carbs = 0.50;
                fat = 0.25;
                break;
        }

        return {
            protein: Math.round((calories * protein) / 4), // 4 calories per gram
            carbs: Math.round((calories * carbs) / 4),
            fat: Math.round((calories * fat) / 9), // 9 calories per gram
            proteinPercent: Math.round(protein * 100),
            carbsPercent: Math.round(carbs * 100),
            fatPercent: Math.round(fat * 100)
        };
    }

    // Estimate body fat percentage (rough estimation)
    estimateBodyFat(bmi, age, gender) {
        let bodyFat;
        if (gender === 'male') {
            bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
        } else {
            bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
        }
        return Math.max(0, Math.min(50, bodyFat)); // Clamp between 0-50%
    }

    // Generate comprehensive fitness analysis
    generateAnalysis(userInput) {
        const { weight, height, age, gender, activityLevel, goal } = userInput;
        
        const bmi = this.calculateBMI(weight, height);
        const bmiCategory = this.getBMICategory(bmi);
        const bmr = this.calculateBMR(weight, height, age, gender);
        const tdee = this.calculateTDEE(bmr, activityLevel);
        const calorieTarget = this.calculateCalorieTarget(tdee, goal);
        const macros = this.calculateMacros(calorieTarget, goal);
        const bodyFat = this.estimateBodyFat(bmi, age, gender);

        return {
            bmi: Math.round(bmi * 10) / 10,
            bmiCategory,
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            calorieTarget: Math.round(calorieTarget),
            macros,
            bodyFat: Math.round(bodyFat * 10) / 10,
            waterIntake: Math.round(weight * 35), // ml per day
            sleepHours: age < 18 ? 9 : (age > 65 ? 7 : 8)
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FitnessCalculator;
}