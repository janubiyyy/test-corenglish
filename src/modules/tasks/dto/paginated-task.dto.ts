import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class PaginatedTaskDto {
  @ApiProperty({
    description: 'Array of tasks',
    type: [Task],
  })
  data: Task[];

  @ApiProperty({
    description: 'Total number of tasks',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}
