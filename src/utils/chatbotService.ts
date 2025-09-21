import { StudentProfile } from '../types/StudentProfile';
import { 
  OpenRouterModelConfig, 
  ModelType, 
  QueryType, 
  ModelResponse, 
  OpenRouterConfig 
} from './openRouterConfig';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface MarketInsight {
  skill: string;
  demand: 'High' | 'Medium' | 'Low';
  salaryRange: string;
  growth: string;
  locations: string[];
}

// Mock market insights data (in a real app, this would come from APIs)
const marketInsights: MarketInsight[] = [
  {
    skill: 'Data Science',
    demand: 'High',
    salaryRange: '₹6-15 LPA',
    growth: '+25% YoY',
    locations: ['Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi']
  },
  {
    skill: 'Full Stack Development',
    demand: 'High',
    salaryRange: '₹5-12 LPA',
    growth: '+20% YoY',
    locations: ['Bangalore', 'Mumbai', 'Pune', 'Chennai', 'Hyderabad']
  },
  {
    skill: 'UI/UX Design',
    demand: 'High',
    salaryRange: '₹4-10 LPA',
    growth: '+30% YoY',
    locations: ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Gurgaon']
  },
  {
    skill: 'Digital Marketing',
    demand: 'Medium',
    salaryRange: '₹3-8 LPA',
    growth: '+15% YoY',
    locations: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai']
  },
  {
    skill: 'Cloud Computing',
    demand: 'High',
    salaryRange: '₹7-16 LPA',
    growth: '+35% YoY',
    locations: ['Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai']
  }
];

// OpenRouter API Service
class OpenRouterApiService {
  private static instance: OpenRouterApiService;
  private config: OpenRouterModelConfig;
  private requestCounts: Map<ModelType, number> = new Map();
  private lastResetTime: number = Date.now();

  private constructor() {
    this.config = OpenRouterModelConfig.getInstance();
  }

  public static getInstance(): OpenRouterApiService {
    if (!OpenRouterApiService.instance) {
      OpenRouterApiService.instance = new OpenRouterApiService();
    }
    return OpenRouterApiService.instance;
  }

  private async callOpenRouterApi(
    config: OpenRouterConfig, 
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    modelType: ModelType
  ): Promise<ModelResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'HTTP-Referer': config.appUrl,
          'X-Title': config.appName
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          temperature: modelType === ModelType.STRUCTURED ? 0.2 : 0.5, // Lower temperature for faster, focused responses
          max_tokens: this.getTokenLimit(modelType), // Optimized token limits
          stream: false,
          // Performance optimizations
          top_p: 0.9, // Slightly more focused responses
          frequency_penalty: 0.1, // Reduce repetition
          presence_penalty: 0.1 // Encourage diversity
        }),
        signal: AbortSignal.timeout(config.timeout)
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      return {
        content: data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.',
        model: config.model,
        tokens: data.usage?.total_tokens,
        responseTime
      };
    } catch (error) {
      console.error(`OpenRouter API Error (${modelType}):`, error);
      throw error;
    }
  }

  private getTokenLimit(modelType: ModelType): number {
    switch (modelType) {
      case ModelType.QUICK:
        return 200;
      case ModelType.CONVERSATIONAL:
        return 600;
      case ModelType.STRUCTURED:
        return 1200;
      default:
        return 600;
    }
  }

  private isRateLimited(modelType: ModelType): boolean {
    const now = Date.now();
    // Only check time every 5 seconds to reduce Date.now() calls
    if (now - this.lastResetTime > 60000) {
      this.requestCounts.clear();
      this.lastResetTime = now;
    }

    const config = this.config.getConfig(modelType);
    const currentCount = this.requestCounts.get(modelType) || 0;
    return currentCount >= config.rateLimit;
  }

  private incrementRequestCount(modelType: ModelType): void {
    const currentCount = this.requestCounts.get(modelType) || 0;
    this.requestCounts.set(modelType, currentCount + 1);
  }

  public async generateResponse(
    userMessage: string,
    queryType: QueryType,
    studentProfile: StudentProfile | null,
    conversationHistory: Message[]
  ): Promise<ModelResponse> {
    if (!this.config.isConfigured()) {
      throw new Error('OpenRouter API not configured. Please add your API key to .env file.');
    }

    const selectedModel = this.config.selectModelForQuery(queryType, userMessage.length);
    const fallbackModels = this.config.getFallbackOrder(selectedModel);
    
    // Create system message based on model type
    const systemMessage = this.createSystemMessage(selectedModel, studentProfile);
    const contextMessages = this.buildContextMessages(conversationHistory, userMessage, systemMessage);

    // Try primary model first, then fallbacks
    for (const modelType of [selectedModel, ...fallbackModels]) {
      if (this.isRateLimited(modelType)) {
        if (this.config.getDebugMode()) {
          const sanitizedModelType = String(modelType).replace(/[\r\n]/g, ' ');
          console.log(`Model ${sanitizedModelType} is rate limited, trying next model`);
        }
        continue;
      }

      try {
        const config = this.config.getConfig(modelType);
        this.incrementRequestCount(modelType);
        
        const response = await this.callOpenRouterApi(config, contextMessages, modelType);
        
        if (this.config.getDebugMode()) {
          console.log(`Successfully used model: ${modelType}`, {
            responseTime: response.responseTime,
            tokens: response.tokens
          });
        }
        
        return response;
      } catch (error) {
        if (this.config.getDebugMode()) {
          const sanitizedModelType = String(modelType).replace(/[\r\n]/g, ' ');
          const sanitizedError = error instanceof Error ? 
            error.message?.replace(/[\r\n]/g, ' ') || 'Unknown error' : 
            String(error).replace(/[\r\n]/g, ' ');
          console.log(`Model ${sanitizedModelType} failed, trying next model: ${sanitizedError}`);
        }
        continue;
      }
    }

    // If all models fail, return fallback response
    return {
      content: this.getFallbackResponse(queryType),
      model: 'fallback',
      responseTime: 0
    };
  }

  private createSystemMessage(modelType: ModelType, studentProfile: StudentProfile | null): string {
    const baseContext = studentProfile ? 
      `Student Profile: ${JSON.stringify(studentProfile, null, 2)}\n\n` : '';

    switch (modelType) {
      case ModelType.STRUCTURED:
        return `${baseContext}You are an expert career advisor using DeepSeek R1. Provide structured, step-by-step analysis and detailed recommendations. Focus on:
1. Multi-step career planning
2. Skill gap analysis
3. Detailed roadmaps
4. Interview preparation strategies
5. Resume optimization

Always be thorough, analytical, and provide actionable steps. Use structured formatting with clear sections and bullet points.`;

      case ModelType.CONVERSATIONAL:
        return `${baseContext}You are a friendly career counselor using DeepSeek V3.1. Provide natural, conversational responses that are:
- Warm and encouraging
- Easy to understand
- Personalized to the student's background
- Motivational and supportive

Keep responses flowing naturally while being helpful and practical.`;

      case ModelType.QUICK:
        return `${baseContext}You are a quick career assistant using DeepSeek R1 Qwen3 8B. Provide:
- Concise, direct answers
- Key bullet points
- Quick summaries
- Fast clarifications

Keep responses brief but valuable, focusing on the most important information.`;

      default:
        return `${baseContext}You are a career advisor for Indian students. Provide helpful, personalized career guidance.`;
    }
  }

  private buildContextMessages(
    conversationHistory: Message[],
    currentMessage: string,
    systemMessage: string
  ): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemMessage }
    ];

    // Add recent conversation history (last 10 messages to manage token usage)
    // Use more efficient array processing
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    // Add current message
    messages.push({ role: 'user', content: currentMessage });

    return messages;
  }

  private getFallbackResponse(queryType: QueryType): string {
    switch (queryType) {
      case QueryType.CAREER_GUIDANCE:
        return "I'm here to help with your career guidance! However, I'm experiencing some technical difficulties right now. Could you please try asking your question again in a moment?";
      
      case QueryType.INTERVIEW_PREP:
        return "I'd love to help you prepare for interviews! I'm having some connection issues at the moment. Please try again shortly, and I'll provide you with detailed interview preparation strategies.";
      
      case QueryType.SKILL_ANALYSIS:
        return "I can help analyze your skills and suggest improvements! I'm currently unable to access my full capabilities. Please retry your question in a moment.";
      
      default:
        return "I'm here to help with your career questions! I'm experiencing some technical issues right now, but please try asking again in a moment.";
    }
  }
}

export const getMarketInsights = async (skill?: string): Promise<MarketInsight[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (skill) {
    return marketInsights.filter(insight => 
      insight.skill.toLowerCase().includes(skill.toLowerCase())
    );
  }
  
  return marketInsights;
};

// Classify user query to determine the best model
const classifyQuery = (message: string): QueryType => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('career') && (lowerMessage.includes('path') || lowerMessage.includes('guidance') || lowerMessage.includes('advice'))) {
    return QueryType.CAREER_GUIDANCE;
  }
  
  if (lowerMessage.includes('roadmap') || lowerMessage.includes('learning plan') || lowerMessage.includes('study plan')) {
    return QueryType.ROADMAP;
  }
  
  if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
    return QueryType.RESUME_COACHING;
  }
  
  if (lowerMessage.includes('skill') && (lowerMessage.includes('gap') || lowerMessage.includes('analysis') || lowerMessage.includes('improve'))) {
    return QueryType.SKILL_ANALYSIS;
  }
  
  if (lowerMessage.includes('interview') || lowerMessage.includes('preparation') || lowerMessage.includes('questions')) {
    return QueryType.INTERVIEW_PREP;
  }
  
  if (lowerMessage.includes('summary') || lowerMessage.includes('summarize') || lowerMessage.includes('brief')) {
    return QueryType.QUICK_SUMMARY;
  }
  
  if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('explain')) {
    return QueryType.CLARIFICATION;
  }
  
  return QueryType.CASUAL_CHAT;
};

export const generateChatResponse = async (
  userMessage: string,
  studentProfile: StudentProfile | null,
  conversationHistory: Message[]
): Promise<string> => {
  const openRouterService = OpenRouterApiService.getInstance();
  const queryType = classifyQuery(userMessage);
  
  try {
    // Try to use DeepSeek API first
    const response = await openRouterService.generateResponse(
      userMessage, 
      queryType, 
      studentProfile, 
      conversationHistory
    );
    
    return response.content;
  } catch (error) {
    console.error('OpenRouter API failed, falling back to mock responses:', error);
    
    // Fallback to existing mock responses
    return generateMockResponse(userMessage, studentProfile, conversationHistory);
  }
};

// Keep existing mock response logic as fallback
const generateMockResponse = async (
  userMessage: string,
  studentProfile: StudentProfile | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _conversationHistory: Message[]
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500)); // Use consistent delay
  
  const message = userMessage.toLowerCase();
  const currentDate = new Date().toLocaleDateString('en-IN');
  
  // Career path questions
  if (message.includes('career') && message.includes('path')) {
    if (studentProfile) {
      const interests = studentProfile.interests.join(', ');
      const strengths = studentProfile.academicStrengths.join(', ');
      return `Based on your profile (interests: ${interests}, strengths: ${strengths}), here are some personalized career paths:

**Top Recommendations for You:**
1. **Data Science** - High demand, ₹6-15 LPA entry level
2. **Software Development** - Excellent growth, ₹5-12 LPA entry level  
3. **UI/UX Design** - Creative + tech, ₹4-10 LPA entry level

**Why these suit you:**
- Your academic strengths align well with analytical roles
- Current market demand is very high (as of ${currentDate})
- Good growth potential in Indian tech hubs

Would you like me to create a detailed learning plan for any of these paths?`;
    } else {
      return `I'd love to suggest personalized career paths! To give you the best recommendations, could you tell me:

1. What subjects do you excel in or enjoy most?
2. What are your main interests or hobbies?
3. What's your current education level?

Based on current market trends (${currentDate}), the most in-demand careers in India are:
- Data Science & Analytics
- Software Development
- UI/UX Design
- Digital Marketing
- Cloud Computing`;
    }
  }
  
  // Salary questions
  if (message.includes('salary') || message.includes('pay')) {
    return `**Current Salary Ranges in India (${currentDate}):**

**Tech Roles:**
• Data Scientist: ₹6-15 LPA (entry), ₹15-30 LPA (3-5 years)
• Software Developer: ₹5-12 LPA (entry), ₹12-25 LPA (3-5 years)
• UI/UX Designer: ₹4-10 LPA (entry), ₹10-20 LPA (3-5 years)

**Business Roles:**
• Digital Marketing: ₹3-8 LPA (entry), ₹8-15 LPA (3-5 years)
• Business Analyst: ₹4-9 LPA (entry), ₹9-18 LPA (3-5 years)

**Factors affecting salary:**
- Location (Bangalore/Mumbai typically 20-30% higher)
- Company size (startups vs MNCs)
- Skills & certifications
- Portfolio quality

Which specific role interests you most?`;
  }
  
  // Skills questions
  if (message.includes('skill') && (message.includes('learn') || message.includes('develop'))) {
    return `**Most In-Demand Skills for 2025:**

**Technical Skills:**
1. **Python Programming** - Essential for data science, automation
2. **JavaScript/React** - Web development, high demand
3. **SQL & Databases** - Data analysis, backend development
4. **Cloud Platforms** (AWS/Azure) - Infrastructure, DevOps
5. **Machine Learning** - AI/ML roles, future-proof

**Soft Skills:**
1. **Communication** - Present ideas clearly
2. **Problem Solving** - Critical thinking
3. **Adaptability** - Learn new technologies
4. **Collaboration** - Work in teams

**Learning Path Recommendation:**
- Start with Python (2-3 months)
- Add SQL for data handling (1 month)
- Choose specialization (web dev/data science/ML)
- Build 3-5 portfolio projects

Want me to create a detailed 6-month learning plan for any specific skill?`;
  }
  
  // Job market questions
  if (message.includes('job') && (message.includes('market') || message.includes('demand'))) {
    return `**Indian Job Market Insights (${currentDate}):**

**Highest Growth Sectors:**
• **EdTech** - 40% growth, remote-friendly
• **FinTech** - 35% growth, good pay scales
• **HealthTech** - 30% growth, social impact
• **E-commerce** - 25% growth, diverse roles

**Top Hiring Cities:**
1. **Bangalore** - Tech capital, 35% of tech jobs
2. **Hyderabad** - Growing fast, lower cost of living
3. **Pune** - Good work-life balance
4. **Mumbai** - Finance + tech hub
5. **Chennai** - Manufacturing + IT

**Remote Work Trends:**
- 60% companies offer hybrid/remote options
- Fully remote roles increased by 200% since 2020
- Skills matter more than location now

**Job Search Tips:**
- LinkedIn optimization is crucial
- GitHub portfolio for tech roles
- Networking through communities
- Apply to 50+ companies for better chances

What specific aspect of the job market interests you?`;
  }
  
  // Location-specific questions
  if (message.includes('bangalore') || message.includes('mumbai') || message.includes('delhi') || message.includes('hyderabad')) {
    const city = message.includes('bangalore') ? 'Bangalore' : 
                 message.includes('mumbai') ? 'Mumbai' :
                 message.includes('delhi') ? 'Delhi' : 'Hyderabad';
    
    const cityData = {
      'Bangalore': {
        strengths: 'Tech capital, highest number of startups, global companies',
        avgSalary: '₹8-15 LPA for tech roles',
        costOfLiving: 'High but manageable',
        opportunities: 'Software, Data Science, Product roles'
      },
      'Mumbai': {
        strengths: 'Financial capital, media industry, diverse opportunities',
        avgSalary: '₹7-14 LPA for tech roles',
        costOfLiving: 'Very high, especially housing',
        opportunities: 'FinTech, Media, Consulting, Tech'
      },
      'Delhi': {
        strengths: 'Government sector, consulting, growing startup scene',
        avgSalary: '₹6-12 LPA for tech roles',
        costOfLiving: 'High, pollution concerns',
        opportunities: 'Consulting, Government tech, Startups'
      },
      'Hyderabad': {
        strengths: 'Growing tech hub, lower cost of living, good infrastructure',
        avgSalary: '₹6-11 LPA for tech roles',
        costOfLiving: 'Moderate, best value for money',
        opportunities: 'Software, Cloud, Data Science'
      }
    };
    
    const data = cityData[city as keyof typeof cityData];
    return `**${city} Career Opportunities (${currentDate}):**

**Key Strengths:** ${data.strengths}
**Average Salary:** ${data.avgSalary}
**Cost of Living:** ${data.costOfLiving}
**Top Opportunities:** ${data.opportunities}

**Major Companies Hiring:**
- Tech: Microsoft, Google, Amazon, Flipkart
- Startups: Byju's, Swiggy, Zomato, Ola
- Consulting: Deloitte, EY, PwC, McKinsey

**Networking Opportunities:**
- Tech meetups and conferences
- Professional communities (LinkedIn groups)
- University alumni networks
- Industry associations

Would you like specific advice for job hunting in ${city}?`;
  }
  
  // Interview preparation
  if (message.includes('interview') || message.includes('preparation')) {
    return `**Interview Preparation Guide:**

**Technical Interview Tips:**
1. **Practice coding** - LeetCode, HackerRank (2-3 problems daily)
2. **System design** - Understand scalability basics
3. **Portfolio projects** - Be ready to explain your code
4. **Mock interviews** - Practice with friends/online platforms

**Behavioral Interview Prep:**
1. **STAR method** - Situation, Task, Action, Result
2. **Common questions:**
   - "Tell me about yourself"
   - "Why this company?"
   - "Describe a challenging project"
   - "Where do you see yourself in 5 years?"

**Day Before Interview:**
- Research the company thoroughly
- Prepare 3-5 questions to ask them
- Test your tech setup (for virtual interviews)
- Get good sleep!

**Sample Technical Questions:**
- "Explain the difference between SQL and NoSQL"
- "How would you optimize a slow website?"
- "Walk me through your project architecture"

Want me to conduct a mock interview with you?`;
  }
  
  // Resume help
  if (message.includes('resume') || message.includes('cv')) {
    return `**Resume Optimization for Indian Job Market:**

**Essential Sections:**
1. **Contact Info** - Phone, email, LinkedIn, GitHub
2. **Professional Summary** - 2-3 lines highlighting key skills
3. **Technical Skills** - Programming languages, tools, frameworks
4. **Experience/Projects** - Use action verbs, quantify results
5. **Education** - Degree, college, relevant coursework
6. **Certifications** - Online courses, professional certifications

**Common Mistakes to Avoid:**
❌ "Responsible for managing data"
✅ "Analyzed 10,000+ customer records using Python, improving decision accuracy by 25%"

❌ "Good communication skills"
✅ "Presented project findings to 50+ stakeholders, leading to 15% budget approval"

**ATS-Friendly Tips:**
- Use standard fonts (Arial, Calibri)
- Include keywords from job description
- Save as PDF
- Keep it 1-2 pages maximum

**Portfolio Integration:**
- GitHub link for developers
- Behance/Dribbble for designers
- LinkedIn for all professionals

Want me to review a specific section of your resume?`;
  }
  
  // Learning resources
  if (message.includes('learn') && (message.includes('free') || message.includes('resource'))) {
    return `**Best Free Learning Resources for Indian Students:**

**Programming & Tech:**
• **FreeCodeCamp** - Complete web development
• **Coursera** - University courses (audit for free)
• **YouTube Channels:** 
  - Code with Harry (Hindi)
  - Apna College (Hindi)
  - Traversy Media (English)

**Indian Platforms:**
• **NPTEL** - IIT/IISc courses, certificates
• **SWAYAM** - Government initiative, free courses
• **Unacademy** - Tech and competitive programming

**Skill-Specific:**
• **Data Science:** Kaggle Learn, Analytics Vidhya
• **Design:** Figma Academy, Adobe tutorials
• **Business:** Google Digital Marketing, HubSpot Academy

**Practice Platforms:**
• **Coding:** LeetCode, HackerRank, CodeChef
• **Projects:** GitHub, personal website
• **Networking:** LinkedIn, Twitter tech community

**Study Strategy:**
1. Choose one primary resource
2. Practice daily (consistency > intensity)
3. Build projects while learning
4. Join study groups/communities
5. Document your learning journey

Which skill area interests you most?`;
  }
  
  // Default response with context awareness
  const responses = [
    `I understand you're asking about "${userMessage}". As your AI Career Advisor, I'm here to help with:

• **Career Path Guidance** - Find the right career for your skills
• **Skill Development** - Learn what's in demand in 2025
• **Job Market Insights** - Current trends and salary ranges
• **Interview Preparation** - Technical and behavioral questions
• **Resume Optimization** - Stand out to recruiters

${studentProfile ? 'Since I have your profile, I can give personalized advice!' : 'Feel free to share your background for personalized guidance.'}

What specific aspect would you like to explore?`,

    `Great question! Let me help you with that. Based on current market trends (${currentDate}), here's what I can share:

**Popular Career Queries:**
- "What career suits my skills?"
- "How much do data scientists earn?"
- "Best skills to learn for remote work?"
- "How to prepare for tech interviews?"

**Quick Market Update:**
- Tech hiring is up 25% this quarter
- Remote work opportunities growing
- AI/ML skills in highest demand
- Soft skills equally important

How can I assist you specifically with your career journey?`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};