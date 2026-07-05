import { Interest } from '../models/Interest.js';

export const seedInterests = async (): Promise<void> => {
  try {
    const count = await Interest.countDocuments();
    if (count > 0) return;

    console.log('[Seeder] Seeding default interests...');

    const defaultInterests = [
      { name: 'Football', category: 'Sports' },
      { name: 'Cricket', category: 'Sports' },
      { name: 'Anime', category: 'Entertainment' },
      { name: 'Reading', category: 'Lifestyle' },
      { name: 'Movies', category: 'Entertainment' },
      { name: 'Gaming', category: 'Tech' },
      { name: 'Traveling', category: 'Adventure' },
      { name: 'Photography', category: 'Arts' },
      { name: 'Coding', category: 'Tech' },
      { name: 'Music', category: 'Arts' },
      { name: 'Cooking', category: 'Lifestyle' },
      { name: 'Fitness', category: 'Sports' },
      { name: 'Yoga', category: 'Lifestyle' },
      { name: 'Hiking', category: 'Adventure' },
      { name: 'Dancing', category: 'Arts' },
    ];

    await Interest.insertMany(defaultInterests);
    console.log('[Seeder] Default interests successfully seeded!');
  } catch (err: any) {
    console.error(`[Seeder Error] Failed to seed interests: ${err.message}`);
  }
};
