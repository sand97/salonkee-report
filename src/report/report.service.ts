import { endOfYear, startOfYear } from 'date-fns'

import { ReportRepository } from '../repositories/reports.repository'
import { formatDate } from '../utils/date'

/**
 * @Warning
 * This service is responsible for report related operations
 * It's not already finish because we need pagination, and trong tests
 */
export default class ReportService {
  private static instance: ReportService = new ReportService()

  private repository = ReportRepository.getInstance()

  static getInstance() {
    return this.instance
  }

  /**
   * Get record for given year or first or last year
   */
  async getReport(
    order: 'ASC' | 'DESC' = 'DESC',
    year?: number,
    date?: { startDate: string; endDate: string },
  ) {
    let startDate: Date, endDate: Date
    if (date) {
      startDate = new Date(date.startDate)
      endDate = new Date(date.endDate)
    } else if (year) {
      startDate = new Date(year, 0, 1)
      endDate = endOfYear(startDate)
    } else {
      const firstOrLastRecord = await this.repository.getBorderReport(order)
      if (!firstOrLastRecord) {
        return []
      }
      startDate = startOfYear(new Date(firstOrLastRecord.start_date))
      endDate = endOfYear(new Date(firstOrLastRecord.start_date))
    }
    return this.repository.getReports(
      formatDate(startDate),
      formatDate(endDate),
    )
  }

  async generateReports() {
    return this.repository.generateReports()
  }
}
