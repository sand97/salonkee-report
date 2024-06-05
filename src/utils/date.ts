import { endOfMonth, addMonths, format, startOfMonth } from 'date-fns'

/**
 * Format date to yyyy-MM-dd
 * @param date
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * get month interval between two dates
 */
export function getMonthsBetweenDates(
  start: string,
  end: string,
): {
  startMonth: string
  endMonth: string
}[] {
  let startDate = startOfMonth(new Date(start))
  const endDate = endOfMonth(new Date(end))
  const months = []
  while (startDate <= endDate) {
    months.push({
      startMonth: formatDate(startDate),
      endMonth: formatDate(endOfMonth(startDate)),
    })
    startDate = addMonths(startDate, 1)
  }
  return months
}
