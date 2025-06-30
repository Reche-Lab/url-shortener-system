import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'simple-array', default: 'user' })
  roles: string[];

  @Column({ type: 'uuid' })
  tenantId: string;

  @ManyToOne('Tenant', { nullable: false })
  @JoinColumn({ name: 'tenantId' })
  tenant: any; // Usamos 'any' por enquanto, depois criaremos a entidade Tenant aqui

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
