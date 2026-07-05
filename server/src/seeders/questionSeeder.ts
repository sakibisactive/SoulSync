import { Question } from '../models/Question.js';

export const seedQuestions = async (): Promise<void> => {
  try {
    const count = await Question.countDocuments();
    if (count >= 50) return;

    console.log('[Seeder] Seeding 50 Likert-scale Personality Questions...');
    await Question.deleteMany({});

    const questionsData = [
      // Extraversion (10)
      { questionNumber: 1, question: 'I enjoy being the center of attention in social gatherings.', category: 'Extraversion', weight: 1.0 },
      { questionNumber: 2, question: 'I start conversations easily with people I do not know well.', category: 'Extraversion', weight: 1.0 },
      { questionNumber: 3, question: 'I feel energized after spending time in large group activities.', category: 'Extraversion', weight: 1.0 },
      { questionNumber: 4, question: 'I enjoy outdoor and high-energy group activities.', category: 'Extraversion', weight: 1.0 },
      { questionNumber: 5, question: 'I express my feelings openly to my partners.', category: 'Extraversion', weight: 1.0 },
      { questionNumber: 6, question: 'I prefer active weekends over staying quiet at home.', category: 'Extraversion', weight: 1.0 },
      { questionNumber: 7, question: 'I make friends quickly in new environments.', category: 'Extraversion', weight: 1.0 },
      { questionNumber: 8, question: 'I love trying vibrant nightlife or spontaneous social plans.', category: 'Extraversion', weight: 1.0 },
      { questionNumber: 9, question: 'I talk to a lot of different people at parties.', category: 'Extraversion', weight: 1.0 },
      { questionNumber: 10, question: 'I prefer working in teams rather than independently.', category: 'Extraversion', weight: 1.0 },

      // Agreeableness (10)
      { questionNumber: 11, question: 'I sympathize with other people’s feelings and struggles.', category: 'Agreeableness', weight: 1.0 },
      { questionNumber: 12, question: 'I place a high value on harmony in relationships.', category: 'Agreeableness', weight: 1.0 },
      { questionNumber: 13, question: 'I am always ready to help my partner when they need support.', category: 'Agreeableness', weight: 1.0 },
      { questionNumber: 14, question: 'I forgive mistakes easily and do not hold long grudges.', category: 'Agreeableness', weight: 1.0 },
      { questionNumber: 15, question: 'I prefer compromise over winning an argument.', category: 'Agreeableness', weight: 1.0 },
      { questionNumber: 16, question: 'I trust people until given a reason not to.', category: 'Agreeableness', weight: 1.0 },
      { questionNumber: 17, question: 'I am polite and respectful even during disagreements.', category: 'Agreeableness', weight: 1.0 },
      { questionNumber: 18, question: 'I enjoy making my loved ones feel special and cared for.', category: 'Agreeableness', weight: 1.0 },
      { questionNumber: 19, question: 'I consider myself a naturally compassionate listener.', category: 'Agreeableness', weight: 1.0 },
      { questionNumber: 20, question: 'I feel deep empathy for animals and nature.', category: 'Agreeableness', weight: 1.0 },

      // Conscientiousness (10)
      { questionNumber: 21, question: 'I keep my personal space organized and tidy.', category: 'Conscientiousness', weight: 1.0 },
      { questionNumber: 22, question: 'I prefer to stick to plans and schedule tasks in advance.', category: 'Conscientiousness', weight: 1.0 },
      { questionNumber: 23, question: 'I am ambitious and dedicated to achieving my career goals.', category: 'Conscientiousness', weight: 1.0 },
      { questionNumber: 24, question: 'I manage my finances prudently and budget for the future.', category: 'Conscientiousness', weight: 1.0 },
      { questionNumber: 25, question: 'I follow through on commitments I make to others.', category: 'Conscientiousness', weight: 1.0 },
      { questionNumber: 26, question: 'I pay attention to small details in my daily life.', category: 'Conscientiousness', weight: 1.0 },
      { questionNumber: 27, question: 'I prefer structured routines over unpredictable days.', category: 'Conscientiousness', weight: 1.0 },
      { questionNumber: 28, question: 'I complete important chores before taking leisure time.', category: 'Conscientiousness', weight: 1.0 },
      { questionNumber: 29, question: 'I take personal accountability for my actions.', category: 'Conscientiousness', weight: 1.0 },
      { questionNumber: 30, question: 'I prioritize health, fitness, and long-term self-care.', category: 'Conscientiousness', weight: 1.0 },

      // Openness (10)
      { questionNumber: 31, question: 'I love exploring new cultures, cuisines, and places.', category: 'Openness', weight: 1.0 },
      { questionNumber: 32, question: 'I am fascinated by art, music, literature, or philosophy.', category: 'Openness', weight: 1.0 },
      { questionNumber: 33, question: 'I enjoy deep intellectual conversations with my partner.', category: 'Openness', weight: 1.0 },
      { questionNumber: 34, question: 'I am eager to learn new skills or hobbies regularly.', category: 'Openness', weight: 1.0 },
      { questionNumber: 35, question: 'I have a vivid imagination and enjoy creative ideas.', category: 'Openness', weight: 1.0 },
      { questionNumber: 36, question: 'I welcome change and adapt quickly to novel situations.', category: 'Openness', weight: 1.0 },
      { questionNumber: 37, question: 'I appreciate abstract ideas and unconventional viewpoints.', category: 'Openness', weight: 1.0 },
      { questionNumber: 38, question: 'I enjoy watching documentary films or reading non-fiction.', category: 'Openness', weight: 1.0 },
      { questionNumber: 39, question: 'I am open to trying unexpected adventures on short notice.', category: 'Openness', weight: 1.0 },
      { questionNumber: 40, question: 'I value creative expression in a relationship.', category: 'Openness', weight: 1.0 },

      // General / Emotional Stability (10)
      { questionNumber: 41, question: 'I remain calm and level-headed under high pressure.', category: 'General', weight: 1.0 },
      { questionNumber: 42, question: 'I rarely feel overwhelmed by stress or sudden changes.', category: 'General', weight: 1.0 },
      { questionNumber: 43, question: 'I feel optimistic about my future and long-term path.', category: 'General', weight: 1.0 },
      { questionNumber: 44, question: 'I communicate openly when something bothers me.', category: 'General', weight: 1.0 },
      { questionNumber: 45, question: 'I bounce back quickly from personal setbacks.', category: 'General', weight: 1.0 },
      { questionNumber: 46, question: 'I feel secure and confident in my identity.', category: 'General', weight: 1.0 },
      { questionNumber: 47, question: 'I give my partner space for their own independence.', category: 'General', weight: 1.0 },
      { questionNumber: 48, question: 'I enjoy humor and lighthearted playfulness daily.', category: 'General', weight: 1.0 },
      { questionNumber: 49, question: 'I am comfortable discussing future plans and family goals.', category: 'General', weight: 1.0 },
      { questionNumber: 50, question: 'I believe mutual trust is the cornerstone of love.', category: 'General', weight: 1.0 },
    ];

    await Question.insertMany(questionsData);
    console.log('[Seeder] 50 Personality Questions successfully seeded!');
  } catch (err: any) {
    console.error(`[Seeder Error] Failed to seed questions: ${err.message}`);
  }
};
