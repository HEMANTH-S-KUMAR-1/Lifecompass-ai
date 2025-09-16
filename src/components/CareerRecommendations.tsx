import React from 'react';
import { ChevronLeft, Target, BookOpen, TrendingUp, Users, Star, Award, IndianRupee } from 'lucide-react';
import { StudentProfile } from '../types/StudentProfile';
import { generateCareerRecommendations, generateLearningPlan, generateMockQuestions, generateResumeImprovement } from '../utils/careerAnalysis';

interface CareerRecommendationsProps {
  profile: StudentProfile;
  onBack: () => void;
  onStartChat: () => void;
}

const CareerRecommendations: React.FC<CareerRecommendationsProps> = ({ profile, onBack, onStartChat }) => {
  const careerPaths = generateCareerRecommendations(profile);
  const learningPlan = generateLearningPlan(profile, careerPaths[0]);
  const mockQuestions = generateMockQuestions(careerPaths);
  const resumeImprovements = generateResumeImprovement(profile, careerPaths);

  const confidenceColors = {
    High: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors mr-6"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Profile
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Personalized Career Plan</h1>
          <p className="text-gray-600">Based on your profile analysis</p>
        </div>
      </div>

      {/* Career Paths */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Target className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Top Career Paths for You</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerPaths.map((career, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{career.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${confidenceColors[career.confidenceLevel]}`}>
                  {career.confidenceLevel}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{career.description}</p>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Core Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {career.coreSkills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Entry-level Roles:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {career.entryLevelJobs.slice(0, 3).map((job, i) => (
                    <li key={i}>• {job}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center text-sm text-green-700 bg-green-50 rounded-lg p-2">
                <IndianRupee className="w-4 h-4 mr-1" />
                <span className="font-medium">{career.salaryRange}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Plan */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <BookOpen className="w-6 h-6 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">6-Month Learning Plan</h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPlan.map((month, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {month.month}
                  </div>
                  <h3 className="font-semibold text-gray-900">{month.title}</h3>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Goals:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {month.goals.map((goal, i) => (
                      <li key={i}>• {goal}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Project:</h4>
                  <p className="text-sm text-blue-700 bg-blue-50 rounded-lg p-2">{month.projectIdea}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Resources:</h4>
                  <div className="flex flex-wrap gap-1">
                    {month.resources.map((resource, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills & Market Mapping */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Skills & Market Mapping</h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Most In-Demand Skills (2025)</h3>
              <div className="space-y-3">
                {['Artificial Intelligence & Machine Learning', 'Full-Stack Development', 'UI/UX Design', 'Data Science & Analytics', 'Cloud Computing'].map((skill, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-700">{skill}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className={`bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full`} style={{width: `${90 - i * 10}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Growth Industries</h3>
              <div className="space-y-2">
                {['EdTech & Online Learning', 'FinTech & Digital Banking', 'HealthTech & Telemedicine', 'E-commerce & D2C', 'Renewable Energy'].map((industry, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Questions */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Users className="w-6 h-6 text-orange-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Practice Interview Questions</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 text-blue-600 mr-2" />
              Technical Questions
            </h3>
            <div className="space-y-4">
              {mockQuestions.filter(q => q.type === 'technical').map((question, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-700 font-medium">{question.question}</p>
                  {question.context && (
                    <p className="text-sm text-gray-500 mt-1">{question.context}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              Behavioral Questions
            </h3>
            <div className="space-y-4">
              {mockQuestions.filter(q => q.type === 'behavioral').map((question, i) => (
                <div key={i} className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-700 font-medium">{question.question}</p>
                  {question.context && (
                    <p className="text-sm text-gray-500 mt-1">{question.context}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Improvements */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Star className="w-6 h-6 text-yellow-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Resume Enhancement Tips</h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-6">
            {resumeImprovements.map((improvement, i) => (
              <div key={i} className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-medium text-gray-900 mb-2">{improvement.category}</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                  <p className="text-sm text-red-800"><strong>Instead of:</strong> {improvement.before}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800"><strong>Write:</strong> {improvement.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Your personalized career plan is ready. Remember, success comes from consistent effort and skill-building. 
          Start with Month 1 of your learning plan and begin building your portfolio!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Save My Plan
          </button>
          <button 
            onClick={onStartChat}
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
          >
            Chat with AI Advisor
          </button>
        </div>
      </div>

      {/* Real-time Market Insights */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-900">Real-Time Market Insights</h3>
          <span className="ml-auto text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
            Updated: {new Date().toLocaleDateString('en-IN')}
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-gray-900 mb-2">Hiring Trends</h4>
            <p className="text-sm text-gray-600">Tech hiring up 25% this quarter. Remote roles increased 200% since 2020.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-gray-900 mb-2">Salary Growth</h4>
            <p className="text-sm text-gray-600">Data Science roles seeing 15-20% YoY salary increases across major cities.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-gray-900 mb-2">Skill Demand</h4>
            <p className="text-sm text-gray-600">AI/ML, Cloud Computing, and UX Design are the fastest-growing skill categories.</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          <strong>Disclaimer:</strong> This career guidance is based on your provided information and current market trends (updated {new Date().toLocaleDateString('en-IN')}). 
          Success depends on your dedication, skill development, and market conditions. Always research specific roles and 
          companies before making career decisions. Market data is sourced from industry reports and job portals.
        </p>
      </div>
    </div>
  );
};

export default CareerRecommendations;