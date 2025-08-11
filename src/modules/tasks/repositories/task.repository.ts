import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { QueryTaskDto } from '../dto/query-task.dto';
import { TaskStatus } from '../enums/task-status.enum';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * Create a new task
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: TaskStatus.TO_DO,
    });
    return await this.taskRepository.save(task);
  }

  /**
   * Find all tasks with filtering and pagination
   */
  async findAll(queryDto: QueryTaskDto): Promise<{ data: Task[]; total: number }> {
    const { status, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const whereConditions: FindManyOptions<Task>['where'] = {};
    if (status) {
      whereConditions.status = status;
    }

    const [data, total] = await this.taskRepository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return { data, total };
  }

  /**
   * Find a task by ID
   */
  async findById(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  /**
   * Update a task by ID
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    // Filter out undefined values and null values for non-nullable fields
    // Note: description can be null (to clear it), but title and status cannot
    const filteredUpdateData = Object.entries(updateTaskDto)
      .filter(([key, value]) => {
        if (value === undefined) {
          return false; // Always filter out undefined
        }
        if (value === null) {
          // Only allow null for description field
          return key === 'description';
        }
        return true; // Include all other values
      })
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    // Only proceed with update if there are fields to update
    if (Object.keys(filteredUpdateData).length > 0) {
      await this.taskRepository.update(id, filteredUpdateData);
    }
    
    return await this.findById(id);
  }

  /**
   * Delete a task by ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    return result.affected > 0;
  }

  /**
   * Check if a task exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.taskRepository.count({ where: { id } });
    return count > 0;
  }
}
