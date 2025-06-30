/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Url } from './url.entity'; // Importe a entidade Url
import { Tenant } from './tenant.entity'; // Importe a entidade Tenant

@Entity('click_events')
export class ClickEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Url, (url) => url.clickEvents)
  @JoinColumn({ name: 'urlId' })
  url: Url;

  @Column({ type: 'uuid' })
  urlId: string;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string | null;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @CreateDateColumn()
  clickedAt: Date;
}
