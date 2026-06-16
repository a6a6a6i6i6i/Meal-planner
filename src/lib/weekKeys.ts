import {
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
  addDays,
  addWeeks,
  subWeeks,
  format,
  setISOWeek,
  setISOWeekYear,
} from "date-fns";

export function getISOWeekKey(date: Date): string {
  const week = getISOWeek(date);
  const year = getISOWeekYear(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function parseWeekKey(weekKey: string): Date {
  const [yearStr, weekStr] = weekKey.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  let d = new Date(year, 0, 4); // Jan 4 is always in week 1
  d = startOfISOWeek(d);
  d = setISOWeekYear(d, year);
  d = setISOWeek(d, week);
  return startOfISOWeek(d);
}

export function getWeekDates(weekKey: string): Date[] {
  const monday = parseWeekKey(weekKey);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function formatDayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getPrevWeekKey(weekKey: string): string {
  const monday = parseWeekKey(weekKey);
  return getISOWeekKey(subWeeks(monday, 1));
}

export function getNextWeekKey(weekKey: string): string {
  const monday = parseWeekKey(weekKey);
  return getISOWeekKey(addWeeks(monday, 1));
}
