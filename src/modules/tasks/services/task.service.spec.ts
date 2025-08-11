import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskRepository } from '../repositories/task.repository';
import { TaskStatus } from '../enums/task-status.enum';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { QueryTaskDto } from '../dto/query-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let repository: TaskRepository;

  const mockTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TO_DO,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTaskRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      mockTaskRepository.create.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(repository.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const queryDto: QueryTaskDto = { page: 1, limit: 10 };
      const mockData = { data: [mockTask], total: 1 };

      mockTaskRepository.findAll.mockResolvedValue(mockData);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [mockTask],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(repository.findAll).toHaveBeenCalledWith(queryDto);
    });

    it('should calculate total pages correctly', async () => {
      const queryDto: QueryTaskDto = { page: 1, limit: 3 };
      const mockData = { data: [mockTask], total: 10 };

      mockTaskRepository.findAll.mockResolvedValue(mockData);

      const result = await service.findAll(queryDto);

      expect(result.totalPages).toBe(4); // Math.ceil(10/3)
    });

    it('should use default page value when page is undefined', async () => {
      const queryDto: QueryTaskDto = { limit: 5 }; // page is undefined
      const mockData = { data: [mockTask], total: 1 };

      mockTaskRepository.findAll.mockResolvedValue(mockData);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [mockTask],
        total: 1,
        page: 1, // should use default value
        limit: 5,
        totalPages: 1,
      });
      expect(repository.findAll).toHaveBeenCalledWith(queryDto);
    });

    it('should use default limit value when limit is undefined', async () => {
      const queryDto: QueryTaskDto = { page: 2 }; // limit is undefined
      const mockData = { data: [mockTask], total: 1 };

      mockTaskRepository.findAll.mockResolvedValue(mockData);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [mockTask],
        total: 1,
        page: 2,
        limit: 10, // should use default value
        totalPages: 1,
      });
      expect(repository.findAll).toHaveBeenCalledWith(queryDto);
    });

    it('should use default values when both page and limit are undefined', async () => {
      const queryDto: QueryTaskDto = {}; // both page and limit are undefined
      const mockData = { data: [mockTask], total: 1 };

      mockTaskRepository.findAll.mockResolvedValue(mockData);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [mockTask],
        total: 1,
        page: 1, // should use default value
        limit: 10, // should use default value
        totalPages: 1,
      });
      expect(repository.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('findById', () => {
    it('should return a task by id', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      const result = await service.findById(taskId);

      expect(result).toEqual(mockTask);
      expect(repository.findById).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException when task not found', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(service.findById(taskId)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
      };
      const updatedTask = { ...mockTask, ...updateTaskDto };

      mockTaskRepository.exists.mockResolvedValue(true);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(repository.exists).toHaveBeenCalledWith(taskId);
      expect(repository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should throw NotFoundException when task not found', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };

      mockTaskRepository.exists.mockResolvedValue(false);

      await expect(service.update(taskId, updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.exists).toHaveBeenCalledWith(taskId);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should handle update with undefined values (should not fail)', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {
        title: undefined,
        status: undefined,
        description: 'Only description updated',
      };
      const updatedTask = { ...mockTask, description: 'Only description updated' };

      mockTaskRepository.exists.mockResolvedValue(true);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(repository.exists).toHaveBeenCalledWith(taskId);
      expect(repository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should handle update with null description (to clear description)', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {
        description: null,
      };
      const updatedTask = { ...mockTask, description: null };

      mockTaskRepository.exists.mockResolvedValue(true);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(repository.exists).toHaveBeenCalledWith(taskId);
      expect(repository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should handle update with empty DTO (no changes)', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {};

      mockTaskRepository.exists.mockResolvedValue(true);
      mockTaskRepository.update.mockResolvedValue(mockTask);

      const result = await service.update(taskId, updateTaskDto);

      expect(result).toEqual(mockTask);
      expect(repository.exists).toHaveBeenCalledWith(taskId);
      expect(repository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should handle partial update with only valid fields', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.DONE,
      };
      const updatedTask = { ...mockTask, status: TaskStatus.DONE };

      mockTaskRepository.exists.mockResolvedValue(true);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(repository.exists).toHaveBeenCalledWith(taskId);
      expect(repository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';

      mockTaskRepository.exists.mockResolvedValue(true);
      mockTaskRepository.delete.mockResolvedValue(true);

      await service.delete(taskId);

      expect(repository.exists).toHaveBeenCalledWith(taskId);
      expect(repository.delete).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException when task not found', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';

      mockTaskRepository.exists.mockResolvedValue(false);

      await expect(service.delete(taskId)).rejects.toThrow(NotFoundException);
      expect(repository.exists).toHaveBeenCalledWith(taskId);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
