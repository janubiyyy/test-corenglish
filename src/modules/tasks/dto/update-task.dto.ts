import { IsString, IsOptional, MaxLength, IsEnum, ValidateIf, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'The title of the task',
    example: 'Updated task title',
    maxLength: 255,
  })
  @ValidateIf((o) => o.title !== undefined)
  @IsString({ message: 'Title must be a string and cannot be null' })
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'The description of the task',
    example: 'Updated task description',
    nullable: true,
  })
  @ValidateIf((o) => o.description !== undefined && o.description !== null)
  @IsString({ message: 'Description must be a string when provided' })
  description?: string | null;

  @ApiPropertyOptional({
    description: 'The status of the task',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @ValidateIf((o) => o.status !== undefined)
  @IsEnum(TaskStatus, { message: 'Status must be a valid TaskStatus enum value and cannot be null' })
  status?: TaskStatus;
}
