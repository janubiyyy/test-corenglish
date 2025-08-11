import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project documentation',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'The description of the task',
    example: 'Write comprehensive documentation for the new task management API',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
