import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'

import { ReportEntity } from './report.entity'

@Entity('EMPLOYEES')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  employee_id: number

  @Column({ type: 'text' })
  first_name: string

  @Column({ type: 'text' })
  last_name: string

  @OneToMany(() => ReportEntity, (report) => report.employee)
  reports: ReportEntity
}
