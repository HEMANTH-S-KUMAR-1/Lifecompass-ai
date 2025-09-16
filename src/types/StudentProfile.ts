export interface StudentProfile {
  age: number;
  education: {
    level: string;
    stream?: string;
    degree?: string;
    class?: string;
  };
  academicStrengths: string[];
  interests: string[];
  location: string;
  socioEconomicConstraints: string;
  aptitudeScores?: {
    logical: number;
    verbal: number;
    quantitative: number;
    spatial: number;
  };
  careerConfusion?: string;
  additionalInfo?: string;
}

export interface CareerPath {
  title: string;
  description: string;
  coreSkills: string[];
  supportingSkills: string[];
  entryLevelJobs: string[];
  salaryRange: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
}

export interface LearningPlan {
  month: number;
  title: string;
  goals: string[];
  weeklyObjectives: string[];
  resources: string[];
  projectIdea: string;
}

export interface MockQuestion {
  type: 'technical' | 'behavioral';
  question: string;
  context?: string;
}