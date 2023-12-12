import { TimeInterval } from '../entities/time-interval.entity';

// ANCHOR MM:SS to seconds
export const timeToSeconds = (time: string) => {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
};

// ANCHOR Calculate the start time available
export const calculateStartAvailable = (intervals: TimeInterval[]) => {
  if (intervals.length === 0) {
    return { startAvailable: '00:00', endAvailable: '60:00' };
  }
  const lastInterval = intervals[intervals.length - 1];
  const startAvailable = lastInterval.end;
  const endAvailable = calculateToMax(lastInterval.end);
  return { startAvailable, endAvailable };
};

// ANCHOR Calculate the end time available (Max: 60:00)
export const calculateToMax = (time: string) => {
  const seconds = timeToSeconds(time);
  const maxSeconds = 60 * 60;
  const newSeconds = seconds + 60;
  const newTime = secondsToTime(newSeconds);
  return newSeconds <= maxSeconds ? newTime : '60:00';
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
  intervals: TimeInterval[],
  newInterval: TimeInterval,
) => {
  const { startAvailable, endAvailable } = calculateStartAvailable(intervals);
  const startAvailableSeconds = timeToSeconds(startAvailable);
  const endAvailableSeconds = timeToSeconds(endAvailable);
  const start = timeToSeconds(newInterval.start);
  const end = timeToSeconds(newInterval.end);
  const isValid = start === startAvailableSeconds && end <= endAvailableSeconds;
  return isValid;
};

// ANCHOR Add interval and return the new array
export const addInterval = (
  intervals: TimeInterval[],
  newInterval: TimeInterval,
) => {
  const isValid = validateNewInterval(intervals, newInterval);
  if (isValid) {
    intervals.push(newInterval);
  }
  return intervals;
};

// ANCHOR Validate Episode Performances
export const validateEpisodePerformances = (intervals: TimeInterval[]) => {
  const isValid =
    intervals.length >= 5 && intervals[intervals.length - 1].end === '60:00';
  return isValid;
};
