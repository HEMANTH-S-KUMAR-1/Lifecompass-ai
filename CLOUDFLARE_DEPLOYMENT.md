# Cloudflare Pages Configuration

This file contains deployment settings for Cloudflare Pages.

## Build Settings
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (project root)

## Environment Variables
Set these in your Cloudflare Pages dashboard:

### Required Variables
```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
VITE_APP_NAME=LifeCompass-AI
VITE_APP_URL=https://your-site.pages.dev
```

### Model Configuration
```
VITE_DEEPSEEK_R1_MODEL=deepseek/deepseek-r1
VITE_DEEPSEEK_V3_MODEL=deepseek/deepseek-v3
VITE_DEEPSEEK_QWEN_MODEL=qwen/qwen-2.5-72b-instruct
VITE_DEFAULT_MODEL=deepseek/deepseek-r1
VITE_FALLBACK_MODEL=deepseek/deepseek-v3
VITE_QUICK_MODEL=qwen/qwen-2.5-72b-instruct
```

### Rate Limiting & Timeouts
```
VITE_R1_RATE_LIMIT=20
VITE_V3_RATE_LIMIT=60
VITE_QWEN_RATE_LIMIT=100
VITE_R1_TIMEOUT=30000
VITE_V3_TIMEOUT=15000
VITE_QWEN_TIMEOUT=10000
```

### Feature Flags
```
VITE_ENABLE_MODEL_SWITCHING=true
VITE_ENABLE_FALLBACK=true
VITE_DEBUG_MODE=false
```

## Security Headers
The `_headers` file includes security headers for:
- XSS protection
- Content type sniffing prevention
- Frame options
- Permissions policy

## SPA Routing
The `_redirects` file ensures all routes are handled by the React app.