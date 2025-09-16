import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, BookOpen, Heart, TrendingUp } from 'lucide-react';
import { StudentProfile } from '../types/StudentProfile';

interface StudentProfileFormProps {
  onSubmit: (profile: StudentProfile) => void;
  onBack: () => void;
}

const StudentProfileForm: React.FC<StudentProfileFormProps> = ({ onSubmit, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StudentProfile>({
    age: 17,
    education: {
      level: '',
      stream: '',
      class: ''
    },
    academicStrengths: [],
    interests: [],
    location: '',
    socioEconomicConstraints: '',
    aptitudeScores: {
      logical: 0,
      verbal: 0,
      quantitative: 0,
      spatial: 0
    }
  });

  const handleInputChange = (field: string, value: string | string[] | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof StudentProfile] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayToggle = (field: 'academicStrengths' | 'interests', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const academicStrengthOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History',
    'Geography', 'Economics', 'Computer Science', 'Arts & Drawing', 'Music',
    'Physical Education', 'Languages', 'Social Studies'
  ];

  const interestOptions = [
    'Technology & Programming', 'Design & Creativity', 'Business & Finance',
    'Healthcare & Medicine', 'Education & Teaching', 'Arts & Entertainment',
    'Sports & Fitness', 'Social Work', 'Research & Science', 'Travel & Tourism',
    'Food & Cooking', 'Environment & Nature', 'Media & Communication',
    'Law & Justice', 'Engineering & Innovation'
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h1>
        <p className="text-gray-600">Help us create your personalized career roadmap</p>
        
        {/* Progress Bar */}
        <div className="flex justify-center mt-6 mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map(i => (
              <React.Fragment key={i}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i}
                </div>
                {i < 4 && (
                  <div className={`w-12 h-1 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="14"
                  max="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location (State/City)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Karnataka, Bangalore"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
              <select
                value={formData.education.level}
                onChange={(e) => handleInputChange('education.level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select education level</option>
                <option value="10th">Class 10th</option>
                <option value="12th">Class 12th</option>
                <option value="undergraduate">Undergraduate (B.Tech/B.A/B.Com etc.)</option>
                <option value="postgraduate">Postgraduate (M.Tech/MBA/M.A etc.)</option>
              </select>
            </div>

            {(formData.education.level === '12th' || formData.education.level === 'undergraduate') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stream/Field</label>
                <input
                  type="text"
                  value={formData.education.stream || ''}
                  onChange={(e) => handleInputChange('education.stream', e.target.value)}
                  placeholder="e.g., PCM, PCB, Commerce, Arts, Computer Science"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Academic Strengths</h2>
            </div>

            <p className="text-gray-600 mb-4">Select the subjects you excel in or enjoy the most:</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {academicStrengthOptions.map(strength => (
                <button
                  key={strength}
                  type="button"
                  onClick={() => handleArrayToggle('academicStrengths', strength)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.academicStrengths.includes(strength)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {strength}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Heart className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Interests & Passions</h2>
            </div>

            <p className="text-gray-600 mb-4">What areas genuinely interest you or excite you?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleArrayToggle('interests', interest)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                    formData.interests.includes(interest)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Socio-Economic Constraints (if any)
              </label>
              <select
                value={formData.socioEconomicConstraints}
                onChange={(e) => handleInputChange('socioEconomicConstraints', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select constraint level</option>
                <option value="none">No major constraints</option>
                <option value="moderate">Moderate - need affordable options</option>
                <option value="high">High - need free/very low-cost options</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career Confusion or Specific Questions (Optional)
              </label>
              <textarea
                value={formData.careerConfusion || ''}
                onChange={(e) => handleInputChange('careerConfusion', e.target.value)}
                placeholder="e.g., Confused between engineering and medicine, worried about job prospects in arts..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any Additional Information
              </label>
              <textarea
                value={formData.additionalInfo || ''}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Family expectations, financial goals, location preferences, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          {step === 1 ? (
            <button
              onClick={onBack}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          ) : (
            <button
              onClick={prevStep}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>
          )}

          {step === 4 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Get My Career Plan
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfileForm;