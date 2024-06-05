import path from 'path'
import { DataSource } from 'typeorm'

import { AppointmentsEntity } from '../entities/appointments.entity'
import { ClientEntity } from '../entities/client.entity'
import { EmployeeEntity } from '../entities/employee.entity'
import { ReportEntity } from '../entities/report.entity'

const database = path.resolve(__dirname, '..', '..', 'db', 'salon.sqlite')

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database,
  entities: [AppointmentsEntity, ClientEntity, EmployeeEntity, ReportEntity],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
})

AppDataSource.initialize()
  .then(() => {
    console.log('🦾 Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })
