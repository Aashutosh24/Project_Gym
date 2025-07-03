# Claude API Integration for Fitness Recommendations

## Overview

This fitness website now includes a powerful AI-powered fitness assistant that provides personalized workout and nutrition recommendations using Claude AI. The integration replaces the previous Gemini implementation with enhanced functionality and better user experience.

## Features

### Enhanced Form Fields
- **Height**: Required field (in cm) with validation (100-250 cm)
- **Weight**: Required field (in kg) with validation (20-300 kg)
- **Fitness Goal**: Required dropdown with options:
  - Lose Weight
  - Gain Muscle
  - Maintain Body
- **Age**: Optional field with validation (13-100 years)
- **Activity Level**: Optional dropdown with options:
  - Sedentary (Little/no exercise)
  - Lightly Active (Light exercise 1-3 days/week)
  - Moderately Active (Moderate exercise 3-5 days/week)
  - Very Active (Hard exercise 6-7 days/week)

### AI-Powered Recommendations
The system provides structured recommendations including:
- 🎯 **Calorie Targets**: Daily calorie goals with explanations
- 🥗 **Macronutrient Breakdown**: Detailed protein, carbs, and fats distribution
- 🏋️ **Exercise Recommendations**: Weekly workout schedules and specific exercises
- 💡 **General Fitness Tips**: Actionable lifestyle recommendations

### Enhanced User Experience
- **Input Validation**: Comprehensive validation with user-friendly error messages
- **Loading States**: Animated loading spinner during API calls
- **Error Handling**: Graceful error handling with informative messages
- **Response Formatting**: Rich text formatting for better readability
- **Save/Print Options**: Users can save recommendations as JSON or print them

## Technical Implementation

### Backend (Netlify Function)
- **File**: `netlify/functions/claude.js`
- **API**: Claude 3 Sonnet via Anthropic API
- **Security**: Environment variable for API key (`CLAUDE_API_KEY`)
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **CORS**: Properly configured CORS headers

### Frontend
- **Enhanced Modal**: Improved UI with better styling and responsive design
- **Validation**: Client-side validation with real-time feedback
- **API Integration**: Robust API calls with error handling
- **Save/Print**: Export functionality for recommendations

## Setup Instructions

1. **Environment Variables**:
   ```bash
   CLAUDE_API_KEY=your_claude_api_key_here
   ```

2. **Dependencies**:
   ```bash
   cd netlify/functions
   npm install
   ```

3. **Local Development**:
   ```bash
   npm run dev
   ```

## API Usage

### Request Format
```javascript
{
  "height": 175,        // Required: height in cm
  "weight": 70,         // Required: weight in kg
  "goal": "gain muscle", // Required: fitness goal
  "age": 25,            // Optional: age in years
  "activityLevel": "moderately active" // Optional: activity level
}
```

### Response Format
```javascript
{
  "reply": "Formatted recommendations with calorie targets, macros, exercises, and tips"
}
```

## Security Features

- **API Key Management**: Secure environment variable storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Proper CORS configuration
- **Error Sanitization**: Safe error messages without exposing sensitive data

## Rate Limiting

The system includes built-in rate limiting through the Anthropic API to prevent abuse and ensure fair usage.

## Future Enhancements

- Integration with fitness tracking APIs
- Meal planning suggestions
- Progress tracking
- User accounts with saved recommendations
- Mobile app integration

## Support

For issues or questions about the Claude API integration, please check:
1. Environment variable configuration
2. API key validity
3. Network connectivity
4. Rate limiting status