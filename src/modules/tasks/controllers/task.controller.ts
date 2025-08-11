import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { QueryTaskDto } from '../dto/query-task.dto';
import { PaginatedTaskDto } from '../dto/paginated-task.dto';
import { Task } from '../entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed.',
  })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filtering and pagination' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter tasks by status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tasks retrieved successfully.',
    type: PaginatedTaskDto,
  })
  async findAll(@Query() queryDto: QueryTaskDto): Promise<PaginatedTaskDto> {
    return await this.taskService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({
    name: 'id',
    description: 'Task ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The task has been found.',
    type: Task,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Task> {
    return await this.taskService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiParam({
    name: 'id',
    description: 'Task ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({
    name: 'id',
    description: 'Task ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.taskService.delete(id);
  }
}
