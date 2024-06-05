import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EmployeeEntity } from './employee.entity';

@Entity('REPORTS')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @Column({ type: 'text' })
  start_date: string;


  @Column({ type: 'int' })
  employee_id: number;

  @Column({ type: 'text' })
  end_date: string;

  @Column({ type: 'float' })
  ratio: number;

  @Column({ type: 'int' })
  count: number;
}
