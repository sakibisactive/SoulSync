import {
  calculatePersonalitySimilarity,
  calculateInterestSimilarity,
  calculateLifestyleSimilarity,
  calculateAgeScore,
  calculateLocationScore,
  computeCompatibility,
} from '../src/algorithms/matchingEngine';

describe('Matching Engine Algorithm Suite', () => {
  describe('Personality Similarity (Cosine Similarity)', () => {
    it('should return 100 for identical personality vectors', () => {
      const vecA = [
        { questionNumber: 1, answer: 5 },
        { questionNumber: 2, answer: 4 },
        { questionNumber: 3, answer: 2 },
      ];
      const vecB = [
        { questionNumber: 1, answer: 5 },
        { questionNumber: 2, answer: 4 },
        { questionNumber: 3, answer: 2 },
      ];
      const score = calculatePersonalitySimilarity(vecA, vecB);
      expect(score).toBe(100);
    });

    it('should compute accurate cosine similarity between vectors [5,4,2,3,5] and [4,5,2,4,5]', () => {
      const vecA = [
        { questionNumber: 1, answer: 5 },
        { questionNumber: 2, answer: 4 },
        { questionNumber: 3, answer: 2 },
        { questionNumber: 4, answer: 3 },
        { questionNumber: 5, answer: 5 },
      ];
      const vecB = [
        { questionNumber: 1, answer: 4 },
        { questionNumber: 2, answer: 5 },
        { questionNumber: 3, answer: 2 },
        { questionNumber: 4, answer: 4 },
        { questionNumber: 5, answer: 5 },
      ];
      const score = calculatePersonalitySimilarity(vecA, vecB);
      expect(score).toBeGreaterThan(90);
    });
  });

  describe('Interest Similarity (Jaccard Index)', () => {
    it('should calculate 50% for 2 overlapping out of 4 total unique interests', () => {
      const interestsA = ['Football', 'Movies', 'Music'];
      const interestsB = ['Movies', 'Music', 'Coding'];
      const score = calculateInterestSimilarity(interestsA, interestsB);
      expect(score).toBe(50);
    });

    it('should return 0 when no interests are shared', () => {
      const interestsA = ['Football', 'Cricket'];
      const interestsB = ['Anime', 'Coding'];
      const score = calculateInterestSimilarity(interestsA, interestsB);
      expect(score).toBe(0);
    });
  });

  describe('Lifestyle Similarity', () => {
    it('should return 100 when all 5 lifestyle choices match exactly', () => {
      const lA = { smoking: 'Never' as const, drinking: 'Socially' as const, exercise: 'Often' as const, diet: 'Halal' as const, pets: 'Dog' as const };
      const lB = { smoking: 'Never' as const, drinking: 'Socially' as const, exercise: 'Often' as const, diet: 'Halal' as const, pets: 'Dog' as const };
      const score = calculateLifestyleSimilarity(lA, lB);
      expect(score).toBe(100);
    });
  });

  describe('Age Preference Score', () => {
    it('should return 100 if both users are within preferred ranges', () => {
      const score = calculateAgeScore(
        25, { minAge: 20, maxAge: 30 },
        27, { minAge: 22, maxAge: 32 }
      );
      expect(score).toBe(100);
    });
  });

  describe('Location Preference (Haversine Distance)', () => {
    it('should return 100 for identical coordinates', () => {
      const profA = { location: { type: 'Point' as const, coordinates: [-74.006, 40.7128] as [number, number] }, preferences: { maxDistanceKm: 50 } } as any;
      const profB = { location: { type: 'Point' as const, coordinates: [-74.006, 40.7128] as [number, number] }, preferences: { maxDistanceKm: 50 } } as any;
      const score = calculateLocationScore(profA, profB);
      expect(score).toBe(100);
    });
  });
});
