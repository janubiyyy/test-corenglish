import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

@Entity('tasks')
export class Task {
  @ApiProperty({
    description: 'Unique identifier for the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project documentation',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Write comprehensive documentation for the new task management API',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'The current status of the task',
    enum: TaskStatus,
    example: TaskStatus.TO_DO,
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TO_DO,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Timestamp when the task was created',
    example: '2023-11-15T10:30:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the task was last updated',
    example: '2023-11-15T15:45:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
