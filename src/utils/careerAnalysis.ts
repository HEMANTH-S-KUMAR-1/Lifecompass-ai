import { StudentProfile, CareerPath, LearningPlan, MockQuestion } from '../types/StudentProfile';

export const generateCareerRecommendations = (profile: StudentProfile): CareerPath[] => {
  const recommendations: CareerPath[] = [];
  
  // Analysis based on academic strengths and interests
  const hasSTEM = profile.academicStrengths.some(s => 
    ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'].includes(s)
  );
  
  const hasTech = profile.interests.includes('Technology & Programming');
  const hasDesign = profile.interests.includes('Design & Creativity');
  const hasBusiness = profile.interests.includes('Business & Finance');
  const hasHealthcare = profile.interests.includes('Healthcare & Medicine');
  
  // Data Science path
  if (hasSTEM && (hasTech || profile.academicStrengths.includes('Mathematics'))) {
    recommendations.push({
      title: 'Data Science & Analytics',
      description: 'Combine mathematics and programming to extract insights from data, helping businesses make informed decisions in the AI-driven economy.',
      coreSkills: ['Python/R Programming', 'Statistics & Mathematics', 'SQL & Databases', 'Machine Learning', 'Data Visualization', 'Excel/Power BI'],
      supportingSkills: ['Communication', 'Problem Solving', 'Critical Thinking', 'Business Acumen'],
      entryLevelJobs: ['Data Analyst', 'Junior Data Scientist', 'Business Analyst', 'Research Analyst', 'Marketing Analyst'],
      salaryRange: '₹6-12 LPA',
      confidenceLevel: 'High'
    });
  }
  
  // Software Development path
  if (hasTech || profile.academicStrengths.includes('Computer Science')) {
    recommendations.push({
      title: 'Software Development',
      description: 'Build applications, websites, and software solutions that power modern businesses and solve real-world problems.',
      coreSkills: ['Programming Languages (Python/Java/JavaScript)', 'Web Development', 'Database Management', 'Version Control (Git)', 'Problem Solving'],
      supportingSkills: ['Team Collaboration', 'Agile Methodologies', 'Testing', 'Documentation'],
      entryLevelJobs: ['Software Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Web Developer'],
      salaryRange: '₹5-10 LPA',
      confidenceLevel: 'High'
    });
  }
  
  // UI/UX Design path
  if (hasDesign || profile.academicStrengths.includes('Arts & Drawing')) {
    recommendations.push({
      title: 'UI/UX Design',
      description: 'Create user-friendly digital experiences by designing interfaces that are both beautiful and functional for apps and websites.',
      coreSkills: ['Figma/Adobe XD', 'User Research', 'Wireframing & Prototyping', 'Design Principles', 'HTML/CSS Basics'],
      supportingSkills: ['Empathy', 'Communication', 'Creative Thinking', 'Attention to Detail'],
      entryLevelJobs: ['UI Designer', 'UX Designer', 'Product Designer', 'Visual Designer', 'Design Intern'],
      salaryRange: '₹4-8 LPA',
      confidenceLevel: hasDesign ? 'High' : 'Medium'
    });
  }
  
  // Digital Marketing path
  if (hasBusiness || profile.interests.includes('Media & Communication')) {
    recommendations.push({
      title: 'Digital Marketing',
      description: 'Help brands reach customers online through social media, content marketing, SEO, and advertising campaigns across digital platforms.',
      coreSkills: ['Social Media Marketing', 'Content Creation', 'Google Ads & Analytics', 'SEO/SEM', 'Email Marketing'],
      supportingSkills: ['Creativity', 'Analytics', 'Writing', 'Communication', 'Adaptability'],
      entryLevelJobs: ['Digital Marketing Executive', 'Content Creator', 'SEO Specialist', 'Social Media Manager', 'Marketing Analyst'],
      salaryRange: '₹3-7 LPA',
      confidenceLevel: 'Medium'
    });
  }
  
  // Healthcare paths
  if (hasHealthcare || profile.academicStrengths.includes('Biology')) {
    recommendations.push({
      title: 'Healthcare & Medical Technology',
      description: 'Work in the growing healthtech sector, combining medical knowledge with technology to improve patient care and healthcare delivery.',
      coreSkills: ['Medical Knowledge', 'Healthcare Systems', 'Medical Software', 'Patient Care', 'Regulatory Compliance'],
      supportingSkills: ['Empathy', 'Attention to Detail', 'Communication', 'Ethics', 'Continuous Learning'],
      entryLevelJobs: ['Medical Coder', 'Healthcare Analyst', 'Clinical Research Associate', 'Health Information Technician'],
      salaryRange: '₹4-8 LPA',
      confidenceLevel: hasHealthcare ? 'High' : 'Medium'
    });
  }
  
  // Financial Technology path
  if (hasBusiness || profile.academicStrengths.includes('Economics')) {
    recommendations.push({
      title: 'Financial Technology (FinTech)',
      description: 'Work in the digital finance sector, developing solutions for banking, payments, investments, and financial services using technology.',
      coreSkills: ['Financial Analysis', 'Excel/Financial Modeling', 'SQL/Data Analysis', 'Regulatory Knowledge', 'Risk Management'],
      supportingSkills: ['Problem Solving', 'Attention to Detail', 'Communication', 'Ethical Reasoning'],
      entryLevelJobs: ['Financial Analyst', 'Risk Analyst', 'Product Analyst', 'Operations Associate', 'Compliance Officer'],
      salaryRange: '₹5-9 LPA',
      confidenceLevel: 'Medium'
    });
  }
  
  // Ensure we have at least 3 recommendations
  if (recommendations.length < 3) {
    // Add generic but relevant paths based on education level
    if (profile.education.level === '12th' || profile.education.level === 'undergraduate') {
      recommendations.push({
        title: 'Business Development',
        description: 'Help companies grow by identifying opportunities, building partnerships, and developing strategies to enter new markets.',
        coreSkills: ['Communication', 'Market Research', 'Sales', 'Relationship Building', 'Presentation Skills'],
        supportingSkills: ['Negotiation', 'Strategic Thinking', 'Networking', 'Time Management'],
        entryLevelJobs: ['Business Development Associate', 'Sales Executive', 'Market Research Analyst', 'Account Manager'],
        salaryRange: '₹3-6 LPA',
        confidenceLevel: 'Medium'
      });
    }
  }
  
  return recommendations.slice(0, 5); // Return top 5 recommendations
};

export const generateLearningPlan = (profile: StudentProfile, primaryCareer: CareerPath): LearningPlan[] => {
  const plan: LearningPlan[] = [];
  
  if (primaryCareer.title.includes('Data Science')) {
    plan.push(
      {
        month: 1,
        title: 'Programming Foundations',
        goals: ['Learn Python basics', 'Understand data types and structures', 'Practice basic programming'],
        weeklyObjectives: ['Week 1: Python syntax', 'Week 2: Variables & operators', 'Week 3: Control structures', 'Week 4: Functions & modules'],
        resources: ['Python.org tutorial', 'Codecademy Python', 'YouTube - Python for Beginners'],
        projectIdea: 'Create a personal expense tracker using Python that reads data from a CSV file'
      },
      {
        month: 2,
        title: 'Statistics & Mathematics',
        goals: ['Master descriptive statistics', 'Learn probability concepts', 'Understand correlation and regression'],
        weeklyObjectives: ['Week 1: Descriptive statistics', 'Week 2: Probability basics', 'Week 3: Distributions', 'Week 4: Correlation analysis'],
        resources: ['Khan Academy Statistics', 'NPTEL Statistics', 'StatQuest YouTube'],
        projectIdea: 'Analyze a public dataset (like Indian census data) and create statistical reports'
      },
      {
        month: 3,
        title: 'Data Manipulation',
        goals: ['Learn Pandas library', 'Master data cleaning techniques', 'Practice data visualization'],
        weeklyObjectives: ['Week 1: Pandas basics', 'Week 2: Data cleaning', 'Week 3: Data transformation', 'Week 4: Basic visualization'],
        resources: ['Pandas documentation', 'Kaggle Learn', 'YouTube - Data Analysis with Python'],
        projectIdea: 'Clean and analyze real messy dataset, create dashboard showing key insights'
      },
      {
        month: 4,
        title: 'Machine Learning Basics',
        goals: ['Understand ML concepts', 'Learn scikit-learn', 'Build first prediction models'],
        weeklyObjectives: ['Week 1: ML theory', 'Week 2: Supervised learning', 'Week 3: Model evaluation', 'Week 4: Project work'],
        resources: ['Coursera ML course', 'Scikit-learn docs', 'Kaggle competitions'],
        projectIdea: 'Build a house price prediction model using Indian real estate data'
      },
      {
        month: 5,
        title: 'Advanced Skills & Portfolio',
        goals: ['Learn SQL database queries', 'Create data visualizations', 'Build portfolio website'],
        weeklyObjectives: ['Week 1: SQL basics', 'Week 2: Advanced SQL', 'Week 3: Tableau/Power BI', 'Week 4: Portfolio creation'],
        resources: ['W3Schools SQL', 'Tableau Public', 'GitHub Pages'],
        projectIdea: 'Create an end-to-end data science project analyzing Indian startup ecosystem'
      },
      {
        month: 6,
        title: 'Job Preparation',
        goals: ['Practice coding interviews', 'Apply to internships', 'Network with professionals'],
        weeklyObjectives: ['Week 1: Resume building', 'Week 2: Interview prep', 'Week 3: Job applications', 'Week 4: Follow-ups'],
        resources: ['LinkedIn', 'AngelList', 'Naukri.com', 'Data science communities'],
        projectIdea: 'Complete a Kaggle competition and document your approach in a detailed blog post'
      }
    );
  } else if (primaryCareer.title.includes('Software Development')) {
    plan.push(
      {
        month: 1,
        title: 'Programming Fundamentals',
        goals: ['Master JavaScript/Python basics', 'Understand programming concepts', 'Practice problem-solving'],
        weeklyObjectives: ['Week 1: Syntax & basics', 'Week 2: Data structures', 'Week 3: Algorithms', 'Week 4: Practice problems'],
        resources: ['FreeCodeCamp', 'MDN Web Docs', 'LeetCode easy problems'],
        projectIdea: 'Build a simple calculator web app with HTML, CSS, and JavaScript'
      },
      {
        month: 2,
        title: 'Web Development Basics',
        goals: ['Learn HTML, CSS fundamentals', 'Understand responsive design', 'Practice with frameworks'],
        weeklyObjectives: ['Week 1: HTML structure', 'Week 2: CSS styling', 'Week 3: Responsive design', 'Week 4: CSS frameworks'],
        resources: ['MDN Web Docs', 'CSS-Tricks', 'Bootstrap documentation'],
        projectIdea: 'Create a responsive personal portfolio website showcasing your projects'
      },
      {
        month: 3,
        title: 'Frontend Framework',
        goals: ['Learn React.js basics', 'Understand component-based architecture', 'Build interactive UIs'],
        weeklyObjectives: ['Week 1: React basics', 'Week 2: Components & props', 'Week 3: State management', 'Week 4: API integration'],
        resources: ['React official docs', 'YouTube React tutorials', 'Create React App'],
        projectIdea: 'Build a task management app with CRUD operations and local storage'
      },
      {
        month: 4,
        title: 'Backend Development',
        goals: ['Learn Node.js/Express', 'Understand databases', 'Build REST APIs'],
        weeklyObjectives: ['Week 1: Node.js basics', 'Week 2: Express framework', 'Week 3: Database integration', 'Week 4: API development'],
        resources: ['Node.js docs', 'Express.js guide', 'MongoDB University'],
        projectIdea: 'Create a blog API with user authentication and CRUD operations'
      },
      {
        month: 5,
        title: 'Full-Stack Project',
        goals: ['Combine frontend and backend', 'Deploy applications', 'Learn version control'],
        weeklyObjectives: ['Week 1: Project planning', 'Week 2: Frontend development', 'Week 3: Backend integration', 'Week 4: Deployment'],
        resources: ['GitHub', 'Netlify/Vercel', 'Heroku documentation'],
        projectIdea: 'Build a complete e-commerce website with product catalog and user accounts'
      },
      {
        month: 6,
        title: 'Job Market Preparation',
        goals: ['Build strong portfolio', 'Practice technical interviews', 'Apply to positions'],
        weeklyObjectives: ['Week 1: Portfolio optimization', 'Week 2: Coding interview prep', 'Week 3: Company research', 'Week 4: Applications'],
        resources: ['GitHub showcase', 'HackerRank', 'Company career pages'],
        projectIdea: 'Contribute to an open-source project and document your contributions'
      }
    );
  } else {
    // Generic learning plan
    plan.push(
      {
        month: 1,
        title: 'Skill Foundation',
        goals: ['Identify core competencies', 'Start skill building', 'Create learning routine'],
        weeklyObjectives: ['Week 1: Skill assessment', 'Week 2: Resource gathering', 'Week 3: Learning schedule', 'Week 4: Practice basics'],
        resources: ['Coursera', 'YouTube', 'Khan Academy'],
        projectIdea: 'Create a learning journal documenting your daily progress and insights'
      },
      {
        month: 2,
        title: 'Practical Application',
        goals: ['Apply learned concepts', 'Start building portfolio', 'Get feedback'],
        weeklyObjectives: ['Week 1: First project', 'Week 2: Skill practice', 'Week 3: Feedback collection', 'Week 4: Improvement iteration'],
        resources: ['Industry blogs', 'Online communities', 'Mentorship platforms'],
        projectIdea: 'Complete your first industry-relevant project and get it reviewed by professionals'
      },
      {
        month: 3,
        title: 'Advanced Concepts',
        goals: ['Learn advanced topics', 'Connect with professionals', 'Expand knowledge'],
        weeklyObjectives: ['Week 1: Advanced learning', 'Week 2: Networking', 'Week 3: Industry trends', 'Week 4: Skill certification'],
        resources: ['Professional courses', 'LinkedIn Learning', 'Industry publications'],
        projectIdea: 'Work on a challenging project that demonstrates advanced skills in your field'
      },
      {
        month: 4,
        title: 'Specialization',
        goals: ['Choose specialization', 'Develop expertise', 'Create unique value'],
        weeklyObjectives: ['Week 1: Specialization research', 'Week 2: Deep skill development', 'Week 3: Expert interviews', 'Week 4: Skill demonstration'],
        resources: ['Specialized courses', 'Expert blogs', 'Industry forums'],
        projectIdea: 'Create a specialized project that showcases your unique expertise'
      },
      {
        month: 5,
        title: 'Portfolio Development',
        goals: ['Build strong portfolio', 'Document achievements', 'Create personal brand'],
        weeklyObjectives: ['Week 1: Portfolio design', 'Week 2: Project documentation', 'Week 3: Personal branding', 'Week 4: Online presence'],
        resources: ['Portfolio platforms', 'Personal website builders', 'Social media guides'],
        projectIdea: 'Launch a comprehensive portfolio website featuring all your best work'
      },
      {
        month: 6,
        title: 'Market Entry',
        goals: ['Apply for opportunities', 'Practice interviews', 'Build professional network'],
        weeklyObjectives: ['Week 1: Job search strategy', 'Week 2: Interview preparation', 'Week 3: Active applications', 'Week 4: Follow-up and networking'],
        resources: ['Job boards', 'Company websites', 'Professional networks'],
        projectIdea: 'Complete a capstone project that demonstrates all your acquired skills'
      }
    );
  }
  
  return plan;
};

export const generateMockQuestions = (careerPaths: CareerPath[]): MockQuestion[] => {
  const questions: MockQuestion[] = [];
  const primaryCareer = careerPaths[0];
  
  // Technical questions based on primary career
  if (primaryCareer.title.includes('Data Science')) {
    questions.push(
      {
        type: 'technical',
        question: 'How would you explain correlation to a non-technical person?',
        context: 'Tests communication skills and understanding of statistical concepts'
      },
      {
        type: 'technical',
        question: 'What steps would you take to clean a messy dataset?',
        context: 'Assesses practical data preprocessing knowledge'
      },
      {
        type: 'technical',
        question: 'Explain the difference between supervised and unsupervised learning with examples.',
        context: 'Tests fundamental machine learning understanding'
      }
    );
  } else if (primaryCareer.title.includes('Software Development')) {
    questions.push(
      {
        type: 'technical',
        question: 'What is the difference between == and === in JavaScript?',
        context: 'Tests understanding of JavaScript fundamentals'
      },
      {
        type: 'technical',
        question: 'How would you optimize a slow-loading webpage?',
        context: 'Assesses web performance optimization knowledge'
      },
      {
        type: 'technical',
        question: 'Explain the concept of RESTful APIs and HTTP methods.',
        context: 'Tests backend development understanding'
      }
    );
  } else {
    questions.push(
      {
        type: 'technical',
        question: 'How do you stay updated with industry trends and developments?',
        context: 'Tests commitment to continuous learning'
      },
      {
        type: 'technical',
        question: 'Describe your approach to learning a new skill or technology.',
        context: 'Assesses learning methodology and adaptability'
      }
    );
  }
  
  // Behavioral questions (universal)
  questions.push(
    {
      type: 'behavioral',
      question: 'Tell me about a time you solved a complex problem. What was your approach?',
      context: 'STAR method: Situation, Task, Action, Result'
    },
    {
      type: 'behavioral',
      question: 'Describe a situation where you had to learn something new quickly.',
      context: 'Tests adaptability and learning agility'
    },
    {
      type: 'behavioral',
      question: 'How do you handle feedback and criticism?',
      context: 'Assesses growth mindset and professional maturity'
    },
    {
      type: 'behavioral',
      question: 'Why are you interested in this role and our company?',
      context: 'Tests preparation and genuine interest'
    }
  );
  
  return questions;
};

export const generateResumeImprovement = (profile: StudentProfile, careerPaths: CareerPath[]) => {
  const improvements = [
    {
      category: 'Skills Section',
      before: 'Good at programming',
      after: 'Proficient in Python and JavaScript with 6+ months of hands-on project experience including data analysis and web development'
    },
    {
      category: 'Project Description',
      before: 'Made a website for college project',
      after: 'Developed a responsive student portal using React.js and Node.js, serving 200+ users with features including authentication, dashboard, and real-time notifications'
    },
    {
      category: 'Achievement Quantification',
      before: 'Participated in coding competition',
      after: 'Ranked in top 15% among 500+ participants in state-level coding competition, solving 4/5 algorithmic problems within time constraints'
    }
  ];
  
  // Add career-specific improvements
  if (careerPaths[0].title.includes('Data Science')) {
    improvements.push({
      category: 'Data Science Projects',
      before: 'Analyzed data using Excel',
      after: 'Performed exploratory data analysis on 10,000+ records using Python and Pandas, identified 3 key insights that improved decision-making accuracy by 25%'
    });
  } else if (careerPaths[0].title.includes('Design')) {
    improvements.push({
      category: 'Design Portfolio',
      before: 'Created some designs',
      after: 'Designed 15+ user interface mockups for mobile and web applications using Figma, incorporating user feedback to improve usability scores by 30%'
    });
  }
  
  return improvements;
};