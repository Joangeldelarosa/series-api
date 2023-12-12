import { Performance } from 'src/series/entities/performance.entity';

// ANCHOR MM:SS to seconds
export const timeToSeconds = (time: string) => {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
};

// ANCHOR Calculate the start time available
export const calculateStartAvailable = (
  performances: Performance[],
  characterId: string,
) => {
  if (performances.length === 0) {
    return '00:00';
  }

  const lastPerformance = performances[performances.length - 1];
  const lastCharacterPerformance = performances.filter(
    (performance) => performance.character.toString() === characterId,
  );

  const lastInterval =
    lastCharacterPerformance.length > 0
      ? lastCharacterPerformance[lastCharacterPerformance.length - 1].interval
      : lastPerformance.interval;

  return lastInterval.end;
};

// ANCHOR Seconds to MM:SS
export const secondsToTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  const time = `${minutes}:${restSeconds}`;
  return time;
};

// ANCHOR Validate the new interval
export const validateNewInterval = (
  performances: Performance[],
  characterId: string,
  newInterval: { start: string; end: string },
) => {
  const startAvailable = calculateStartAvailable(performances, characterId);
  const startAvailableSeconds = timeToSeconds(startAvailable);
  // always max is 60:00
  const endAvailableSeconds = 3600;
  const start = timeToSeconds(newInterval.start);
  const end = timeToSeconds(newInterval.end);
  const isValid = start >= startAvailableSeconds && end <= endAvailableSeconds;
  return isValid;
};

// ANCHOR Validate Episode Performances
export const validateEpisodePerformances = (performances: Performance[]) => {
  if (performances.length < 5) {
    return false;
  }

  const sortedPerformances = performances
    .flatMap((performance) => performance.interval)
    .sort((a, b) => timeToSeconds(a.start) - timeToSeconds(b.start));

  for (let i = 1; i < sortedPerformances.length; i++) {
    const currentEnd = timeToSeconds(sortedPerformances[i - 1].end);
    const nextStart = timeToSeconds(sortedPerformances[i].start);

    if (nextStart > currentEnd) {
      return false;
    }
  }

  const lastInterval = sortedPerformances[sortedPerformances.length - 1];
  const lastIntervalEnd = timeToSeconds(lastInterval.end);
  if (lastIntervalEnd < 3600) {
    return false;
  }

  return true;
};
