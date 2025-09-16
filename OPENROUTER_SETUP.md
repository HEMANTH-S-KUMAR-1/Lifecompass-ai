# OpenRouter AI Integration Setup

## Overview
LifeCompass AI uses OpenRout# These will use DeepSeek V3 (conversational)
"What's it like working in tech in India?"
"Tell me about the startup culture in Bangalore"

# These will use Qwen 2.5 72B (quick responses)
"Summarize the key skills for UX design"
"What does API stand for?"
"Quick overview of machine learning"cess multiple AI models for intelligent career guidance:

- **DeepSeek R1** (Primary): Structured reasoning, detailed analysis, career planning
- **DeepSeek V3** (Fallback): Natural conversations, smooth interactions  
- **Qwen 2.5 72B** (Quick): Fast responses, summaries, clarifications

## Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Create account or sign in
3. Navigate to Keys section
4. Generate a new API key
5. Copy the key for next step

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file and replace with your API key
VITE_OPENROUTER_API_KEY=your_actual_api_key_here
```

### 3. Model Behavior

The system automatically selects the best model based on query type:

| Query Type | Model Used | Behavior |
|------------|------------|----------|
| Career Guidance | DeepSeek R1 | Structured, step-by-step analysis |
| Roadmaps | DeepSeek R1 | Detailed learning plans |
| Resume Coaching | DeepSeek R1 | Comprehensive feedback |
| Skill Analysis | DeepSeek R1 | In-depth skill gap analysis |
| Interview Prep | DeepSeek R1 | Thorough preparation strategies |
| Casual Chat | DeepSeek V3 | Natural, conversational tone |
| Quick Summaries | Qwen 2.5 72B | Fast, concise responses |
| Clarifications | Qwen 2.5 72B | Brief explanations |

### 4. Fallback System

If a model is unavailable or rate-limited:
1. **Primary model fails** → Try fallback model
2. **All models fail** → Use built-in mock responses
3. **Rate limiting** → Automatically switch to available model

### 5. Configuration Options

```env
# Rate limiting (requests per minute)
VITE_R1_RATE_LIMIT=20          # DeepSeek R1
VITE_V3_RATE_LIMIT=60          # DeepSeek V3  
VITE_QWEN_RATE_LIMIT=100       # Qwen 2.5 72B

# Response timeouts (milliseconds)
VITE_R1_TIMEOUT=30000          # 30 seconds for detailed analysis
VITE_V3_TIMEOUT=15000          # 15 seconds for conversations
VITE_QWEN_TIMEOUT=10000        # 10 seconds for quick responses

# Feature toggles
VITE_ENABLE_MODEL_SWITCHING=true    # Enable automatic model selection
VITE_ENABLE_FALLBACK=true           # Enable fallback system
VITE_DEBUG_MODE=false               # Show model selection logs
```

### 6. Usage Examples

The system automatically chooses the right model:

```typescript
// These queries will use DeepSeek R1 (structured analysis)
"I need a detailed career roadmap for data science"
"Help me analyze my skill gaps for software engineering"
"Can you review my resume and provide feedback?"

// These will use DeepSeek V3.1 (conversational)
"What's it like working in tech in India?"
"Tell me about the startup culture in Bangalore"

// These will use Qwen3 8B (quick responses)
"Summarize the key skills for UX design"
"What does API stand for?"
"Quick overview of machine learning"
```

### 7. Error Handling

The system gracefully handles:
- API key not configured → Falls back to mock responses
- Rate limiting → Switches to available model
- Network errors → Tries fallback models
- Timeout errors → Uses faster model

### 8. Cost Optimization

- **Smart model selection** reduces API costs
- **Rate limiting** prevents overuse  
- **Caching** (future feature) will reduce redundant calls
- **Fallback system** ensures reliability without extra cost

## Development

To test the integration:

```bash
# Enable debug mode to see model selection
VITE_DEBUG_MODE=true

# Check browser console for model usage logs
# Test different query types to see model switching
```