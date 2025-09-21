import { useState, lazy, Suspense } from 'react';
import { BookOpen, Target, TrendingUp, Users, ChevronRight, GraduationCap, MessageCircle, Loader2 } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import { StudentProfile } from './types/StudentProfile';

// Lazy load components for better performance
const StudentProfileForm = lazy(() => import('./components/StudentProfileForm'));
const CareerRecommendations = lazy(() => import('./components/CareerRecommendations'));
const ChatBot = lazy(() => import('./components/ChatBot'));

// Loading component for suspense fallback
const LoadingFallback = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

function App() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'profile' | 'results' | 'chat'>('welcome');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleProfileSubmit = (profile: StudentProfile) => {
    setStudentProfile(profile);
    setCurrentStep('results');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {currentStep === 'welcome' && (
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Career Journey Starts Here
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized career guidance with real-time market insights tailored for Indian students. Discover your path, build the right skills, and land your dream job.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Paths</h3>
              <p className="text-gray-600">Get 3-5 career recommendations based on your unique profile and interests</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">6-Month Learning Plan</h3>
              <p className="text-gray-600">Structured monthly goals with free resources and portfolio projects</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Insights</h3>
              <p className="text-gray-600">Current salary ranges and in-demand skills in the Indian job market</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Readiness</h3>
              <p className="text-gray-600">Mock interviews and resume tips to help you land your first job</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl p-8 mb-16 shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
                <div className="text-gray-600">Career Paths</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setCurrentStep('profile')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Start Your Career Analysis
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => setShowChat(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Chat with AI Advisor
                <MessageCircle className="w-5 h-5 ml-2" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">Free • No registration required • Instant results</p>
          </div>
        </div>
      )}

      {currentStep === 'profile' && (
        <Suspense fallback={<LoadingFallback message="Loading profile form..." />}>
          <StudentProfileForm 
            onSubmit={handleProfileSubmit}
            onBack={() => setCurrentStep('welcome')}
          />
        </Suspense>
      )}

      {currentStep === 'results' && studentProfile && (
        <Suspense fallback={<LoadingFallback message="Generating your career recommendations..." />}>
          <CareerRecommendations 
            profile={studentProfile}
            onBack={() => setCurrentStep('profile')}
            onStartChat={() => setShowChat(true)}
          />
        </Suspense>
      )}

      {/* Floating Chat Button */}
      {!showChat && currentStep !== 'welcome' && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Modal */}
      {showChat && (
        <Suspense fallback={<LoadingFallback message="Starting AI advisor..." />}>
          <ChatBot 
            onClose={() => setShowChat(false)}
            studentProfile={studentProfile}
          />
        </Suspense>
      )}
      </div>
    </ErrorBoundary>
  );
}

export default App;