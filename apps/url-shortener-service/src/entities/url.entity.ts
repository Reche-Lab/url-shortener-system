// apps/url-shortener-service/src/entities/url.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('urls') // Nome da tabela no banco de dados
export class Url {
  @PrimaryGeneratedColumn('uuid') // ID único para cada URL, usando UUID
  id: string;

  @Column({ unique: true, length: 6 }) // O código curto, deve ser único e ter 6 caracteres
  shortCode: string;

  @Column({ type: 'text' }) // A URL original completa
  originalUrl: string;

  @Column({ default: 0 }) // Contador de cliques, inicia em 0
  clicks: number;

  // Campo para associar a URL a um usuário (opcional, para usuários autenticados)
  // Por enquanto, pode ser nulo. Será preenchido na feature de autenticação.
  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn() // Data de criação do registro
  createdAt: Date;

  @UpdateDateColumn() // Data da última atualização do registro
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true }) // Data de exclusão lógica (soft delete)
  deletedAt: Date;
}
