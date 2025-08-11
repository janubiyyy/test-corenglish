import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { QueryTaskDto } from '../dto/query-task.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { BadRequestException } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

const mockTaskService = {
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const mockTask = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.TO_DO,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      mockTaskService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });

    it('should create a task without description', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task Without Description',
      };
      const expectedTask = { ...mockTask, title: 'Test Task Without Description', description: undefined };

      mockTaskService.create.mockResolvedValue(expectedTask);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual(expectedTask);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const queryDto: QueryTaskDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [mockTask],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockTaskService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(queryDto);
    });

    it('should handle empty query DTO', async () => {
      const queryDto: QueryTaskDto = {};
      const paginatedResult = {
        data: [mockTask],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockTaskService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('findById', () => {
    it('should return a task by id', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';

      mockTaskService.findById.mockResolvedValue(mockTask);

      const result = await controller.findById(taskId);

      expect(result).toEqual(mockTask);
      expect(service.findById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';

      mockTaskService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(taskId);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(taskId);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
      };
      const updatedTask = { ...mockTask, ...updateTaskDto };

      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(service.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should handle update with only description', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {
        description: 'Updated description only',
      };
      const updatedTask = { ...mockTask, description: 'Updated description only' };

      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(service.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should handle empty update DTO', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {};

      mockTaskService.update.mockResolvedValue(mockTask);

      const result = await controller.update(taskId, updateTaskDto);

      expect(result).toEqual(mockTask);
      expect(service.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should handle update with null description (to clear description)', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {
        description: null,
      };
      const updatedTask = { ...mockTask, description: null };

      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(service.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should handle status-only update', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.IN_PROGRESS,
      };
      const updatedTask = { ...mockTask, status: TaskStatus.IN_PROGRESS };

      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(service.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should handle title-only update', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {
        title: 'New Task Title',
      };
      const updatedTask = { ...mockTask, title: 'New Task Title' };

      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(service.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });
  });
});
