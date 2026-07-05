import React, { useState, useEffect } from 'react';
import { useGetMeQuery } from '../../redux/services/authApi';
import {
  useUpdateProfileMutation,
  useGetQuestionsQuery,
  useSubmitPersonalityMutation,
  useGetInterestsQuery,
  useUpdateInterestsMutation,
  useAddPhotoMutation,
} from '../../redux/services/profileApi';
import { Save, Sparkles, CheckCircle2, Sliders, Image, ListChecks, Share2, Search, AlertCircle } from 'lucide-react';

const POPULAR_COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Bangladesh',
  'Germany', 'France', 'Japan', 'India', 'United Arab Emirates',
  'Singapore', 'Brazil', 'Italy', 'Spain', 'Netherlands',
  'Sweden', 'Switzerland', 'South Korea', 'Turkey', 'Saudi Arabia',
  'Egypt', 'South Africa', 'Nigeria', 'Mexico', 'Indonesia'
];

const POPULAR_CITIES = [
  'New York', 'London', 'Paris', 'Tokyo', 'Sydney',
  'Toronto', 'Berlin', 'Dubai', 'Singapore', 'Dhaka',
  'Los Angeles', 'Chicago', 'San Francisco', 'Miami', 'Vancouver',
  'Melbourne', 'Amsterdam', 'Madrid', 'Rome', 'Mumbai',
  'Delhi', 'Seoul', 'Istanbul', 'Riyadh', 'Barcelona'
];

const POPULAR_OCCUPATIONS = [
  'Software Engineer', 'Data Scientist', 'Product Designer', 'Architect',
  'Doctor / Physician', 'Financial Analyst', 'Marketing Specialist',
  'Entrepreneur / Founder', 'Lawyer / Attorney', 'Accountant', 'Civil Engineer',
  'Mechanical Engineer', 'Photographer', 'Journalist', 'Chef / Culinary Artist',
  'University Professor', 'School Teacher', 'Pilot', 'Registered Nurse',
  'Graphic Designer', 'Fitness Trainer / Coach', 'Content Creator', 'Student', 'Other'
];

const POPULAR_EDUCATION = [
  'High School Diploma', 'Associate Degree', 'Bachelor of Science (B.Sc)',
  'Bachelor of Arts (B.A)', 'Bachelor of Business (BBA)', 'Bachelor of Engineering (B.Eng)',
  'Master of Science (M.Sc)', 'Master of Business Administration (MBA)',
  'Doctor of Medicine (MD)', 'Ph.D. / Doctorate', 'Juris Doctor (J.D)',
  'Diploma / Vocational Training', 'Self-Taught / Professional Experience', 'Other'
];

export const EditProfilePage: React.FC = () => {
  const { data: meData, refetch: refetchMe, isLoading: isMeLoading } = useGetMeQuery(undefined);
  const { data: questionsData } = useGetQuestionsQuery(undefined);
  const { data: interestsData } = useGetInterestsQuery(undefined);

  const [updateProfile] = useUpdateProfileMutation();
  const [submitPersonality] = useSubmitPersonalityMutation();
  const [updateInterests] = useUpdateInterestsMutation();
  const [addPhoto] = useAddPhotoMutation();

  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'personality' | 'interests' | 'photos'>('basic');
  const [savedSuccessMessage, setSavedSuccessMessage] = useState('');

  // Basic Info state
  const [bio, setBio] = useState('');
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState('Male');

  // Dropdown states
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');

  // Custom input fallbacks if "Other" is typed
  const [customCity, setCustomCity] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [customOccupation, setCustomOccupation] = useState('');
  const [customEducation, setCustomEducation] = useState('');

  // Lifestyle state - NO AUTOMATIC DEFAULTS
  const [smoking, setSmoking] = useState<string>('');
  const [drinking, setDrinking] = useState<string>('');
  const [exercise, setExercise] = useState<string>('');
  const [diet, setDiet] = useState<string>('');
  const [pets, setPets] = useState<string>('');

  // Optional Social Links state
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [snapchat, setSnapchat] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Personality 50 answers state
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Interests state & Search
  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
  const [hobbySearch, setHobbySearch] = useState('');

  // Photo URL input state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    if (meData?.profile) {
      const p = meData.profile;
      setBio(p.bio || '');
      setAge(p.age || 24);
      setGender(p.gender || 'Male');

      // Set City & Country
      if (p.city) {
        if (POPULAR_CITIES.includes(p.city)) setCity(p.city);
        else {
          setCity('Other');
          setCustomCity(p.city);
        }
      }
      if (p.country) {
        if (POPULAR_COUNTRIES.includes(p.country)) setCountry(p.country);
        else {
          setCountry('Other');
          setCustomCountry(p.country);
        }
      }

      // Set Occupation & Education
      if (p.occupation) {
        if (POPULAR_OCCUPATIONS.includes(p.occupation)) setOccupation(p.occupation);
        else {
          setOccupation('Other');
          setCustomOccupation(p.occupation);
        }
      }
      if (p.education) {
        if (POPULAR_EDUCATION.includes(p.education)) setEducation(p.education);
        else {
          setEducation('Other');
          setCustomEducation(p.education);
        }
      }

      if (p.lifestyle) {
        setSmoking(p.lifestyle.smoking || '');
        setDrinking(p.lifestyle.drinking || '');
        setExercise(p.lifestyle.exercise || '');
        setDiet(p.lifestyle.diet || '');
        setPets(p.lifestyle.pets || '');
      }

      if (p.socialLinks) {
        setFacebook(p.socialLinks.facebook || '');
        setInstagram(p.socialLinks.instagram || '');
        setSnapchat(p.socialLinks.snapchat || '');
        setWhatsapp(p.socialLinks.whatsapp || '');
      }

      if (p.personalityAnswers && Array.isArray(p.personalityAnswers)) {
        const initialAnswers: Record<number, number> = {};
        p.personalityAnswers.forEach((ans: any) => {
          if (ans && typeof ans.questionNumber === 'number') {
            initialAnswers[ans.questionNumber] = ans.answer;
          }
        });
        setAnswers(initialAnswers);
      }

      if (p.interests && Array.isArray(p.interests)) {
        const ids = p.interests
          .map((i: any) => (typeof i === 'string' ? i : i?._id ? String(i._id) : ''))
          .filter(Boolean);
        setSelectedInterestIds(ids);
      }
    }
  }, [meData]);

  const effectiveCity = city === 'Other' ? customCity : city;
  const effectiveCountry = country === 'Other' ? customCountry : country;
  const effectiveOccupation = occupation === 'Other' ? customOccupation : occupation;
  const effectiveEducation = education === 'Other' ? customEducation : education;

  // Live Completion percentage calculation
  const calculateLiveCompletion = (): number => {
    let score = 0;
    if (bio && bio.trim().length >= 10) score += 5;
    if (effectiveCity && effectiveCountry) score += 5;
    if (effectiveOccupation && effectiveEducation) score += 5;
    if (age >= 18 && gender) score += 5;

    // Lifestyle choices
    if (smoking && drinking && exercise && diet && pets) score += 20;

    // Photos
    if (meData?.profile?.photos && Array.isArray(meData.profile.photos) && meData.profile.photos.length >= 1) {
      score += 15;
    }

    // Hobbies
    if (Array.isArray(selectedInterestIds) && selectedInterestIds.length >= 3) score += 20;

    // 50 Questions
    if (answers && typeof answers === 'object' && Object.keys(answers).length >= 50) score += 25;

    return Math.min(100, score);
  };

  const completionPercentage = calculateLiveCompletion();

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        bio,
        age,
        gender,
        city: effectiveCity,
        country: effectiveCountry,
        occupation: effectiveOccupation,
        education: effectiveEducation,
        lifestyle: {
          smoking: smoking || undefined,
          drinking: drinking || undefined,
          exercise: exercise || undefined,
          diet: diet || undefined,
          pets: pets || undefined,
        },
      }).unwrap();
      setSavedSuccessMessage('Profile details & lifestyle choices saved!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        socialLinks: { facebook, instagram, snapchat, whatsapp },
      }).unwrap();
      setSavedSuccessMessage('Social Media accounts saved!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const handleSavePersonality = async () => {
    const formattedAnswers = Object.entries(answers).map(([qNum, ans]) => ({
      questionNumber: parseInt(qNum, 10),
      answer: ans,
    }));

    try {
      await submitPersonality(formattedAnswers).unwrap();
      setSavedSuccessMessage('Personality questionnaire saved successfully!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const toggleInterest = (id: string) => {
    if (!id) return;
    if (selectedInterestIds.includes(id)) {
      setSelectedInterestIds(selectedInterestIds.filter((item) => item !== id));
    } else {
      setSelectedInterestIds([...selectedInterestIds, id]);
    }
  };

  const handleSaveInterests = async () => {
    try {
      await updateInterests(selectedInterestIds).unwrap();
      setSavedSuccessMessage('Hobbies updated!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const handleAddPhoto = async () => {
    if (!newPhotoUrl) return;
    try {
      await addPhoto(newPhotoUrl).unwrap();
      setNewPhotoUrl('');
      setSavedSuccessMessage('Photo added!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const filteredInterests = (interestsData?.interests || []).filter((item: any) => {
    if (!item) return false;
    const nameStr = (item.name || '').toLowerCase();
    const catStr = (item.category || '').toLowerCase();
    const queryStr = (hobbySearch || '').toLowerCase();
    return nameStr.includes(queryStr) || catStr.includes(queryStr);
  });

  if (isMeLoading) {
    return <div className="py-20 text-center text-slate-400">Loading your profile setup...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Completion Badge */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-outfit">Edit Profile</h1>
            <p className="text-slate-400 text-sm">Reach 100% completion to unlock discovery & partner matching.</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Profile Completion</span>
              <span className={`text-xl font-extrabold ${completionPercentage === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {completionPercentage}% {completionPercentage === 100 ? '✓ Ready' : ''}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
              {completionPercentage}%
            </div>
          </div>
        </div>

        {savedSuccessMessage && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-4 h-4" /> {savedSuccessMessage}
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'basic'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" /> Basic & Lifestyle Choices
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'social'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" /> Social Links (Optional)
          </button>
          <button
            onClick={() => setActiveTab('interests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'interests'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Hobbies ({selectedInterestIds.length})
          </button>
          <button
            onClick={() => setActiveTab('personality')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'personality'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ListChecks className="w-4 h-4" /> 50 Qs ({Object.keys(answers).length}/50)
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Image className="w-4 h-4" /> Photos
          </button>
        </div>
      </div>

      {/* Tab 1: Basic & Manual Lifestyle Choices */}
      {activeTab === 'basic' && (
        <form onSubmit={handleSaveBasic} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white font-outfit">Basic Details & Lifestyle</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Bio / Story</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 rounded-xl glass-input text-sm"
              placeholder="Tell your future partner about your life, values, and goals..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-sm bg-slate-900"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>

            {/* Country Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`w-full p-3 rounded-xl glass-input text-sm bg-slate-900 ${!country ? 'border-amber-500/50' : ''}`}
              >
                <option value="">-- Select Country --</option>
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other / Custom Write-In</option>
              </select>
              {country === 'Other' && (
                <input
                  type="text"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  placeholder="Enter your custom country name..."
                  className="w-full p-2.5 mt-2 rounded-xl glass-input text-xs"
                />
              )}
            </div>

            {/* City Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full p-3 rounded-xl glass-input text-sm bg-slate-900 ${!city ? 'border-amber-500/50' : ''}`}
              >
                <option value="">-- Select City --</option>
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other / Custom Write-In</option>
              </select>
              {city === 'Other' && (
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="Enter your custom city name..."
                  className="w-full p-2.5 mt-2 rounded-xl glass-input text-xs"
                />
              )}
            </div>

            {/* Occupation Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Occupation</label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className={`w-full p-3 rounded-xl glass-input text-sm bg-slate-900 ${!occupation ? 'border-amber-500/50' : ''}`}
              >
                <option value="">-- Select Occupation --</option>
                {POPULAR_OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {occupation === 'Other' && (
                <input
                  type="text"
                  value={customOccupation}
                  onChange={(e) => setCustomOccupation(e.target.value)}
                  placeholder="Enter custom occupation..."
                  className="w-full p-2.5 mt-2 rounded-xl glass-input text-xs"
                />
              )}
            </div>

            {/* Education Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Education Level</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className={`w-full p-3 rounded-xl glass-input text-sm bg-slate-900 ${!education ? 'border-amber-500/50' : ''}`}
              >
                <option value="">-- Select Education --</option>
                {POPULAR_EDUCATION.map((ed) => (
                  <option key={ed} value={ed}>{ed}</option>
                ))}
              </select>
              {education === 'Other' && (
                <input
                  type="text"
                  value={customEducation}
                  onChange={(e) => setCustomEducation(e.target.value)}
                  placeholder="Enter custom education background..."
                  className="w-full p-2.5 mt-2 rounded-xl glass-input text-xs"
                />
              )}
            </div>
          </div>

          {/* MANUALLY SELECT ALL 5 LIFESTYLE CHOICE DROPDOWNS */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Lifestyle Attributes (Choose Manually)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Smoking</label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value)}
                  className={`w-full p-3 rounded-xl glass-input text-sm bg-slate-900 ${!smoking ? 'border-amber-500/50' : ''}`}
                >
                  <option value="">-- Select Smoking Choice --</option>
                  <option value="Never">Never</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Regularly">Regularly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Drinking</label>
                <select
                  value={drinking}
                  onChange={(e) => setDrinking(e.target.value)}
                  className={`w-full p-3 rounded-xl glass-input text-sm bg-slate-900 ${!drinking ? 'border-amber-500/50' : ''}`}
                >
                  <option value="">-- Select Drinking Choice --</option>
                  <option value="Never">Never</option>
                  <option value="Socially">Socially</option>
                  <option value="Regularly">Regularly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Exercise</label>
                <select
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className={`w-full p-3 rounded-xl glass-input text-sm bg-slate-900 ${!exercise ? 'border-amber-500/50' : ''}`}
                >
                  <option value="">-- Select Exercise Frequency --</option>
                  <option value="Never">Never</option>
                  <option value="Sometimes">Sometimes</option>
                  <option value="Often">Often</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Diet</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className={`w-full p-3 rounded-xl glass-input text-sm bg-slate-900 ${!diet ? 'border-amber-500/50' : ''}`}
                >
                  <option value="">-- Select Diet Type --</option>
                  <option value="Anything">Anything</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="Halal">Halal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Pets Preference</label>
                <select
                  value={pets}
                  onChange={(e) => setPets(e.target.value)}
                  className={`w-full p-3 rounded-xl glass-input text-sm bg-slate-900 ${!pets ? 'border-amber-500/50' : ''}`}
                >
                  <option value="">-- Select Pets Preference --</option>
                  <option value="None">None</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                  <option value="Both">Both</option>
                  <option value="Lover">Pet Lover</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" /> Save Basic Info & Lifestyle
          </button>
        </form>
      )}

      {/* Tab 2: Optional Social Media Links */}
      {activeTab === 'social' && (
        <form onSubmit={handleSaveSocial} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-outfit">Social Media Handles (Optional)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Adding social links is not mandatory. If added, your matches can connect with you directly.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Facebook Profile URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/username (Optional)"
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram Username / Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username (Optional)"
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Snapchat Username</label>
              <input
                type="text"
                value={snapchat}
                onChange={(e) => setSnapchat(e.target.value)}
                placeholder="snap_username (Optional)"
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number / Link</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+1234567890 (Optional)"
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" /> Save Social Links
          </button>
        </form>
      )}

      {/* Tab 3: Hobbies Selector */}
      {activeTab === 'interests' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-outfit">Select at least 3 Hobbies</h2>
              <p className="text-xs text-slate-400">Select any hobbies below to automate compatibility matching (Jaccard Index).</p>
            </div>
            <button
              onClick={handleSaveInterests}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" /> Save Selected Hobbies ({selectedInterestIds.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={hobbySearch}
              onChange={(e) => setHobbySearch(e.target.value)}
              placeholder="Search hobbies (e.g., Scuba Diving, Tennis, Painting, Chess)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 max-h-[50vh] overflow-y-auto pr-2">
            {filteredInterests.map((item: any) => {
              const itemId = String(item._id || '');
              const isSelected = selectedInterestIds.includes(itemId);
              return (
                <button
                  key={itemId || item.name}
                  type="button"
                  onClick={() => toggleInterest(itemId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  #{item.name} <span className="text-[10px] opacity-60">({item.category})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: 50 Likert-Scale Personality Questions */}
      {activeTab === 'personality' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white font-outfit">50 Personality Questions ({Object.keys(answers).length}/50)</h2>
              <p className="text-xs text-slate-400">Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).</p>
            </div>
            <button
              onClick={handleSavePersonality}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" /> Save All 50 Answers
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {(questionsData?.questions || []).map((q: any) => (
              <div key={q.questionNumber} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold text-indigo-400">Q{q.questionNumber}</span>
                  <p className="text-sm font-medium text-slate-200 flex-grow">{q.question}</p>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                    {q.category}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 max-w-md mx-auto pt-1">
                  <span className="text-[10px] text-slate-500">Strongly Disagree</span>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAnswers({ ...answers, [q.questionNumber]: val })}
                      className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all ${
                        answers[q.questionNumber] === val
                          ? 'bg-gradient-to-tr from-rose-500 to-indigo-600 text-white scale-110 shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                  <span className="text-[10px] text-slate-500">Strongly Agree</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Photo Gallery */}
      {activeTab === 'photos' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white font-outfit">Photo Gallery</h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="Paste image URL (e.g. Unsplash or Cloudinary)..."
              className="flex-grow p-3 rounded-xl glass-input text-sm"
            />
            <button
              onClick={handleAddPhoto}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
            >
              Add Photo
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {meData?.profile?.photos?.map((photo: any, index: number) => (
              <div key={index} className="relative rounded-2xl overflow-hidden group border border-slate-800">
                <img src={photo.url} alt="Profile photo" className="w-full h-40 object-cover" />
                {photo.isMain && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                    Main Photo
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
