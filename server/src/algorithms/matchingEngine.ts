import { IProfile, IPersonalityAnswer } from '../models/Profile.js';

export interface CompatibilityBreakdown {
  personality: number; // 0 to 100
  interest: number;    // 0 to 100
  lifestyle: number;   // 0 to 100
  age: number;         // 0 to 100
  location: number;    // 0 to 100
  finalScore: number;  // 0 to 100
}

/**
 * 1. Personality Similarity (Cosine Similarity over 50 Likert-scale questions)
 */
export function calculatePersonalitySimilarity(
  answersA: IPersonalityAnswer[],
  answersB: IPersonalityAnswer[]
): number {
  if (!answersA || !answersB || answersA.length === 0 || answersB.length === 0) {
    return 50; // Default fallback score if incomplete answers
  }

  const mapB = new Map<number, number>();
  answersB.forEach((ans) => mapB.set(ans.questionNumber, ans.answer));

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  answersA.forEach((ansA) => {
    const valA = ansA.answer;
    const valB = mapB.get(ansA.questionNumber) || 3; // Default neutral answer (3)

    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });

  if (normA === 0 || normB === 0) return 50;

  const cosine = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  // Scale cosine (which ranges 0-1 for positive values) to 0-100
  return Math.min(100, Math.max(0, Math.round(cosine * 100)));
}

/**
 * 2. Interest Similarity (Jaccard Similarity Index)
 */
export function calculateInterestSimilarity(
  interestsA: string[],
  interestsB: string[]
): number {
  if (!interestsA || !interestsB || interestsA.length === 0 || interestsB.length === 0) {
    return 0;
  }

  const setA = new Set(interestsA.map((id) => id.toString()));
  const setB = new Set(interestsB.map((id) => id.toString()));

  let intersectionCount = 0;
  setA.forEach((item) => {
    if (setB.has(item)) intersectionCount++;
  });

  const unionSize = new Set([...setA, ...setB]).size;
  if (unionSize === 0) return 0;

  const jaccard = intersectionCount / unionSize;
  return Math.min(100, Math.max(0, Math.round(jaccard * 100)));
}

/**
 * 3. Lifestyle Similarity (Weighted Attributes)
 */
export function calculateLifestyleSimilarity(
  lifestyleA: IProfile['lifestyle'],
  lifestyleB: IProfile['lifestyle']
): number {
  if (!lifestyleA || !lifestyleB) return 50;

  let totalScore = 0;

  // Smoking (weight 25%)
  if (lifestyleA.smoking === lifestyleB.smoking) totalScore += 25;
  else if (
    (lifestyleA.smoking === 'Never' && lifestyleB.smoking === 'Occasionally') ||
    (lifestyleA.smoking === 'Occasionally' && lifestyleB.smoking === 'Never')
  ) {
    totalScore += 12.5;
  }

  // Drinking (weight 25%)
  if (lifestyleA.drinking === lifestyleB.drinking) totalScore += 25;
  else if (
    (lifestyleA.drinking === 'Never' && lifestyleB.drinking === 'Socially') ||
    (lifestyleA.drinking === 'Socially' && lifestyleB.drinking === 'Never')
  ) {
    totalScore += 12.5;
  }

  // Exercise (weight 20%)
  if (lifestyleA.exercise === lifestyleB.exercise) totalScore += 20;
  else totalScore += 10;

  // Diet (weight 15%)
  if (lifestyleA.diet === lifestyleB.diet) totalScore += 15;
  else if (lifestyleA.diet === 'Anything' || lifestyleB.diet === 'Anything') totalScore += 10;

  // Pets (weight 15%)
  if (lifestyleA.pets === lifestyleB.pets) totalScore += 15;
  else if (lifestyleA.pets === 'Lover' || lifestyleB.pets === 'Lover') totalScore += 10;

  return Math.min(100, Math.max(0, Math.round(totalScore)));
}

/**
 * 4. Age Preference Score
 */
export function calculateAgeScore(
  ageA: number,
  prefRangeB: { minAge: number; maxAge: number },
  ageB: number,
  prefRangeA: { minAge: number; maxAge: number }
): number {
  const evaluateRange = (targetAge: number, range: { minAge: number; maxAge: number }): number => {
    if (targetAge >= range.minAge && targetAge <= range.maxAge) return 100;
    const diff = targetAge < range.minAge ? range.minAge - targetAge : targetAge - range.maxAge;
    return Math.max(0, 100 - diff * 15); // Reduce by 15 points per year out of range
  };

  const scoreAtoB = evaluateRange(ageB, prefRangeA);
  const scoreBtoA = evaluateRange(ageA, prefRangeB);

  return Math.round((scoreAtoB + scoreBtoA) / 2);
}

/**
 * 5. Location Preference Score (Haversine Distance calculation)
 */
export function calculateLocationScore(
  profileA: Partial<IProfile>,
  profileB: Partial<IProfile>
): number {
  const coordsA = profileA.location?.coordinates;
  const coordsB = profileB.location?.coordinates;

  if (coordsA && coordsB && coordsA.length === 2 && coordsB.length === 2) {
    const [lon1, lat1] = coordsA;
    const [lon2, lat2] = coordsB;

    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    const maxDist = Math.max(
      profileA.preferences?.maxDistanceKm || 100,
      profileB.preferences?.maxDistanceKm || 100
    );

    if (distanceKm <= maxDist) return 100;
    return Math.max(0, Math.round(100 - ((distanceKm - maxDist) / maxDist) * 100));
  }

  // Fallback to City/Country check
  if (profileA.city && profileB.city && profileA.city.toLowerCase() === profileB.city.toLowerCase()) {
    return 100;
  }
  if (profileA.country && profileB.country && profileA.country.toLowerCase() === profileB.country.toLowerCase()) {
    return 70;
  }

  return 30;
}

/**
 * Master Weighted Compatibility Score Engine
 */
export function computeCompatibility(
  profileA: IProfile,
  profileB: IProfile
): CompatibilityBreakdown {
  const personalityScore = calculatePersonalitySimilarity(
    profileA.personalityAnswers,
    profileB.personalityAnswers
  );

  const interestScore = calculateInterestSimilarity(
    (profileA.interests || []).map((i) => i.toString()),
    (profileB.interests || []).map((i) => i.toString())
  );

  const lifestyleScore = calculateLifestyleSimilarity(
    profileA.lifestyle,
    profileB.lifestyle
  );

  const ageScore = calculateAgeScore(
    profileA.age,
    profileA.preferences || { minAge: 18, maxAge: 50 },
    profileB.age,
    profileB.preferences || { minAge: 18, maxAge: 50 }
  );

  const locationScore = calculateLocationScore(profileA, profileB);

  // Formula: 35% Personality + 25% Interest + 20% Lifestyle + 10% Age + 10% Location
  const finalScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        0.35 * personalityScore +
          0.25 * interestScore +
          0.20 * lifestyleScore +
          0.10 * ageScore +
          0.10 * locationScore
      )
    )
  );

  return {
    personality: personalityScore,
    interest: interestScore,
    lifestyle: lifestyleScore,
    age: ageScore,
    location: locationScore,
    finalScore,
  };
}
