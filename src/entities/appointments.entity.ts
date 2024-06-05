import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EmployeeEntity } from './employee.entity';
import { ClientEntity } from './client.entity';

@Entity('APPOINTMENTS')
export class AppointmentsEntity {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @ManyToOne(() => ClientEntity)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ type: 'text' })
  date: string;
}

export type AppointmentsReport = {
  client_count: number;
  employee_id: number;
  date: string;
}