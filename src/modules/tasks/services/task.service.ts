import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { QueryTaskDto } from '../dto/query-task.dto';
import { PaginatedTaskDto } from '../dto/paginated-task.dto';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * Create a new task
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.create(createTaskDto);
  }

  /**
   * Get all tasks with optional filtering and pagination
   */
  async findAll(queryDto: QueryTaskDto): Promise<PaginatedTaskDto> {
    const { page = 1, limit = 10 } = queryDto;
    const { data, total } = await this.taskRepository.findAll(queryDto);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get a single task by ID
   */
  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  /**
   * Update a task by ID
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Check if task exists
    const exists = await this.taskRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    const updatedTask = await this.taskRepository.update(id, updateTaskDto);
    return updatedTask;
  }

  /**
   * Delete a task by ID
   */
  async delete(id: string): Promise<void> {
    const exists = await this.taskRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    await this.taskRepository.delete(id);
  }
}
