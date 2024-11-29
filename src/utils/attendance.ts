import { AttendanceEntry } from '../types/attendance';

export function calculateAttendancePercentage(
  entries: AttendanceEntry[],
  duration: string
): number {
  // Convert duration string to minutes
  const durationInMinutes = parseDuration(duration);
  if (durationInMinutes === 0) return 0;
  
  // Calculate total attended minutes
  const totalAttendedMinutes = entries.reduce((total, entry) => {
    if (!entry.joinTime || !entry.leaveTime) return total;
    
    const joinTime = parseTimeToMinutes(entry.joinTime);
    const leaveTime = parseTimeToMinutes(entry.leaveTime);
    return total + (leaveTime - joinTime);
  }, 0);

  // Calculate percentage
  return Math.round((totalAttendedMinutes / durationInMinutes) * 100);
}

export function determineAttendanceStatus(
  attendancePercentage: number,
  completionThreshold: number
): 'Completed' | 'Not Completed' {
  return attendancePercentage >= completionThreshold ? 'Completed' : 'Not Completed';
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+(?:\.\d+)?)\s*(hour|hours)/);
  if (!match) return 0;
  return Math.round(parseFloat(match[1]) * 60); // Convert hours to minutes
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
}