import { addDays, endOfMonth, startOfMonth } from 'date-fns'

import {
  AppointmentsEntity,
  AppointmentsReport,
} from '../entities/appointments.entity'
import { EmployeeEntity } from '../entities/employee.entity'
import { ReportEntity } from '../entities/report.entity'
import { AppDataSource } from '../orm/typeorm'
import { formatDate, getMonthsBetweenDates } from '../utils/date'

export class ReportRepository {
  private static instance: ReportRepository = new ReportRepository()

  static getInstance() {
    return this.instance
  }

  /**
   * Get report for given period
   */
  async getReports(startDate: string, endDate: string) {
    return AppDataSource.manager
      .getRepository(EmployeeEntity)
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.reports', 'report')
      .where(
        'report.start_date >= :startDate AND report.end_date <= :endDate',
        {
          startDate,
          endDate,
        },
      )
      .orderBy('report.start_date', 'ASC')
      .getMany()
  }

  /**
   * Get first or last report
   */
  async getBorderReport(order: 'ASC' | 'DESC') {
    return (
      await AppDataSource.manager.find(ReportEntity, {
        order: {
          start_date: order,
        },
        take: 1,
      })
    )[0]
  }

  /**
   * Generate reports
   */
  async generateReports() {
    const firstReport = await this.getBorderReport('ASC')
    if (firstReport) {
      return false
    }

    const firstAppointment = await this.getBorderAppointment('ASC')
    const lastAppointment = await this.getBorderAppointment('DESC')
    if (!firstAppointment) {
      throw new Error('No appointments found')
    }
    const referenceReports = await this.getMonthReport(
      firstAppointment.date,
      true,
    )
    console.log('referenceReports', referenceReports)
    await this.saveReports(referenceReports)

    //TODO what happen for Employee without appointment ??

    // we get the start of the next month (reference month + 1 day)
    const startOfReport = addDays(
      endOfMonth(new Date(firstAppointment.date)),
      1,
    )
    // we get the months between the first and last appointment for classic reports
    const months = getMonthsBetweenDates(
      formatDate(startOfReport),
      lastAppointment.date,
    )
    console.log('next month', months)
    await Promise.all(
      months.map(async ({ startMonth, endMonth }) => {
        const classicReports = await this.getIntervalAppointment(
          startMonth,
          endMonth,
          false,
        )
        console.log(
          `report for period ${startMonth} - ${endMonth}`,
          classicReports,
        )

        await this.saveReports(
          classicReports.map((report) => {
            const referenceReport = referenceReports.find(
              (r) => r.employee_id === report.employee_id,
            )
            // TODO update this depending on the requirement
            referenceReports.push(report)
            return {
              ...report,
              ratio:
                (report.client_count /
                  (referenceReport ?? report).client_count) *
                100,
            }
          }),
        )
      }),
    )
    return true
  }

  async saveReports(reports: (AppointmentsReport & { ratio?: number })[]) {
    return AppDataSource.manager
      .getRepository(ReportEntity)
      .createQueryBuilder()
      .insert()
      .into(ReportEntity)
      .values(
        reports.map((report) => ({
          start_date: formatDate(startOfMonth(new Date(report.date))),
          end_date: formatDate(endOfMonth(new Date(report.date))),
          employee_id: report.employee_id,
          ratio: report.ratio ?? 100,
          count: report.client_count,
        })),
      )
      .execute()
  }

  /**
   * Generate a report for a specific month with given date
   * @param date
   * @param distinct
   */
  async getMonthReport(date: string, distinct: boolean) {
    const startDate = formatDate(startOfMonth(new Date(date)))
    const endDate = formatDate(endOfMonth(new Date(date)))
    return this.getIntervalAppointment(startDate, endDate, distinct)
  }

  /**
   * Generate a report for a specific date interval
   * @param startDate
   * @param endDate
   * @param distinct
   */
  async getIntervalAppointment(
    startDate: string,
    endDate: string,
    distinct: boolean,
  ) {
    const appointmentsBuilder = AppDataSource.manager
      .getRepository(AppointmentsEntity)
      .createQueryBuilder('appointment')
      .select('appointment.employee_id', 'employee_id')
      .addSelect('appointment.date', 'date')
      .addSelect('COUNT(DISTINCT appointment.client_id)', 'client_count')

    if (distinct) {
      appointmentsBuilder.addSelect(
        'COUNT(DISTINCT appointment.client_id)',
        'client_count',
      )
    } else {
      appointmentsBuilder.addSelect(
        'COUNT(appointment.client_id)',
        'client_count',
      )
    }

    return appointmentsBuilder
      .where('appointment.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('appointment.employee_id')
      .orderBy('appointment.date', 'ASC')
      .getRawMany<AppointmentsReport>()
  }

  /**
   * Get the first or last appointment based on date
   */
  async getBorderAppointment(order: 'ASC' | 'DESC') {
    return (
      await AppDataSource.manager.find(AppointmentsEntity, {
        order: {
          date: order,
        },
        take: 1,
      })
    )[0]
  }

  async addAppointmentInReport(appointment: AppointmentsEntity) {
    /**
     * TODO
     * 1. Find oldest(reference) report for current employee
     * 1.2 If no report found, create a new one and return
     * 1.3 If report find check if client_id is include in this report then return
     * 1.4 If not increment it
     * 2. Find report for date of appointment
     * 2.2 If no report found, create a new one and return
     * 2.3 If report found increment it
     */
  }
  async incrementReport(report_id: number, client_id: number) {
    /**
     * TODO
     * 1. Find report by id
     * 2. Increment client_count
     */
  }
  async createReport(employee_id: number, date: string) {
    /**
     * TODO
     * 1. Create a new report for employee_id and month of date
     */
  }
}
