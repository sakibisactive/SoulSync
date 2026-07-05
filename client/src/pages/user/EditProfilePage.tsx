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
import { motion } from 'framer-motion';
import { Save, Sparkles, CheckCircle2, Sliders, Image, ListChecks, Heart } from 'lucide-react';

export const EditProfilePage: React.FC = () => {
  const { data: meData, refetch: refetchMe } = useGetMeQuery({});
  const { data: questionsData } = useGetQuestionsQuery({});
  const { data: interestsData } = useGetInterestsQuery({});

  const [updateProfile] = useUpdateProfileMutation();
  const [submitPersonality] = useSubmitPersonalityMutation();
  const [updateInterests] = useUpdateInterestsMutation();
  const [addPhoto] = useAddPhotoMutation();

  const [activeTab, setActiveTab] = useState<'basic' | 'personality' | 'interests' | 'photos'>('basic');
  const [savedSuccessMessage, setSavedSuccessMessage] = useState('');

  // Basic Info state
  const [bio, setBio] = useState('');
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState('Male');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');

  // Lifestyle state
  const [smoking, setSmoking] = useState('Never');
  const [drinking, setDrinking] = useState('Socially');
  const [exercise, setExercise] = useState('Sometimes');

  // Personality 50 answers state
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Interests state
  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);

  // Photo URL input state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    if (meData?.profile) {
      const p = meData.profile;
      setBio(p.bio || '');
      setAge(p.age || 24);
      setGender(p.gender || 'Male');
      setCity(p.city || 'New York');
      setCountry(p.country || 'USA');
      setOccupation(p.occupation || '');
      setEducation(p.education || '');
      if (p.lifestyle) {
        setSmoking(p.lifestyle.smoking || 'Never');
        setDrinking(p.lifestyle.drinking || 'Socially');
        setExercise(p.lifestyle.exercise || 'Sometimes');
      }

      if (p.personalityAnswers) {
        const initialAnswers: Record<number, number> = {};
        p.personalityAnswers.forEach((ans: any) => {
          initialAnswers[ans.questionNumber] = ans.answer;
        });
        setAnswers(initialAnswers);
      }

      if (p.interests) {
        setSelectedInterestIds(p.interests.map((i: any) => i._id || i));
      }
    }
  }, [meData]);

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        bio,
        age,
        gender,
        city,
        country,
        occupation,
        education,
        lifestyle: { smoking, drinking, exercise, diet: 'Anything', pets: 'Lover' },
      }).unwrap();
      setSavedSuccessMessage('Profile details saved!');
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
    if (selectedInterestIds.includes(id)) {
      setSelectedInterestIds(selectedInterestIds.filter((item) => item !== id));
    } else {
      setSelectedInterestIds([...selectedInterestIds, id]);
    }
  };

  const handleSaveInterests = async () => {
    try {
      await updateInterests(selectedInterestIds).unwrap();
      setSavedSuccessMessage('Interests updated!');
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Tabs */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-outfit">Edit Profile</h1>
            <p className="text-slate-400 text-sm">Update your information, photos, interests, and 50 personality questions.</p>
          </div>
          {savedSuccessMessage && (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> {savedSuccessMessage}
            </div>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'basic'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" /> Basic & Lifestyle
          </button>
          <button
            onClick={() => setActiveTab('personality')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'personality'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ListChecks className="w-4 h-4" /> 50 Personality Questions ({Object.keys(answers).length}/50)
          </button>
          <button
            onClick={() => setActiveTab('interests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'interests'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Passions & Interests
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Image className="w-4 h-4" /> Photos & Gallery
          </button>
        </div>
      </div>

      {/* Tab 1: Basic & Lifestyle */}
      {activeTab === 'basic' && (
        <form onSubmit={handleSaveBasic} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white font-outfit">Basic Details</h2>

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
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
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
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Occupation</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Software Engineer, Designer..."
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="B.Sc Computer Science..."
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" /> Save Basic Info
          </button>
        </form>
      )}

      {/* Tab 2: 50 Likert-Scale Personality Questions */}
      {activeTab === 'personality' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white font-outfit">50 Personality Questions</h2>
              <p className="text-xs text-slate-400">Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).</p>
            </div>
            <button
              onClick={handleSavePersonality}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" /> Save All 50 Answers
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {questionsData?.questions?.map((q: any) => (
              <div key={q.questionNumber} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold text-indigo-400">Q{q.questionNumber}</span>
                  <p className="text-sm font-medium text-slate-200 flex-grow">{q.question}</p>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                    {q.category}
                  </span>
                </div>

                {/* 1-5 Likert scale buttons */}
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

      {/* Tab 3: Passions & Interests */}
      {activeTab === 'interests' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white font-outfit">Select Your Hobbies & Interests</h2>
              <p className="text-xs text-slate-400">Used by the Jaccard Similarity algorithm (25% weight).</p>
            </div>
            <button
              onClick={handleSaveInterests}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" /> Save Interests
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {interestsData?.interests?.map((item: any) => {
              const isSelected = selectedInterestIds.includes(item._id);
              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => toggleInterest(item._id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  #{item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Photo Gallery */}
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
