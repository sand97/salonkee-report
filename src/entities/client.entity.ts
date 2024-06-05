import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('CLIENTS')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  client_id: number;

  @Column({type: 'text'})
  first_name: string;

  @Column({type: 'text'})
  last_name: string;

  @Column({type: 'text'})
  gender: string;
}
