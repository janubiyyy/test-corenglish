import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepository } from './task.repository';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { QueryTaskDto } from '../dto/query-task.dto';
import { TaskStatus } from '../enums/task-status.enum';

const mockTypeOrmRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockTask: Task = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.TO_DO,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TaskRepository', () => {
  let repository: TaskRepository;
  let typeOrmRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<TaskRepository>(TaskRepository);
    typeOrmRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const taskToCreate = {
        ...createTaskDto,
        status: TaskStatus.TO_DO,
      };

      mockTypeOrmRepository.create.mockReturnValue(taskToCreate);
      mockTypeOrmRepository.save.mockResolvedValue(mockTask);

      const result = await repository.create(createTaskDto);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(taskToCreate);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(taskToCreate);
      expect(result).toEqual(mockTask);
    });

    it('should create task with default TO_DO status', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
      };

      const taskToCreate = {
        ...createTaskDto,
        status: TaskStatus.TO_DO,
      };

      mockTypeOrmRepository.create.mockReturnValue(taskToCreate);
      mockTypeOrmRepository.save.mockResolvedValue({ ...mockTask, ...taskToCreate });

      const result = await repository.create(createTaskDto);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(taskToCreate);
      expect(result.status).toBe(TaskStatus.TO_DO);
    });
  });

  describe('findAll', () => {
    it('should find all tasks with pagination', async () => {
      const queryDto: QueryTaskDto = { page: 1, limit: 10 };
      const mockData = [mockTask];
      const mockTotal = 1;

      mockTypeOrmRepository.findAndCount.mockResolvedValue([mockData, mockTotal]);

      const result = await repository.findAll(queryDto);

      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual({ data: mockData, total: mockTotal });
    });

    it('should find tasks with status filter', async () => {
      const queryDto: QueryTaskDto = { status: TaskStatus.IN_PROGRESS, page: 1, limit: 5 };
      const mockData = [{ ...mockTask, status: TaskStatus.IN_PROGRESS }];
      const mockTotal = 1;

      mockTypeOrmRepository.findAndCount.mockResolvedValue([mockData, mockTotal]);

      const result = await repository.findAll(queryDto);

      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        where: { status: TaskStatus.IN_PROGRESS },
        skip: 0,
        take: 5,
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual({ data: mockData, total: mockTotal });
    });

    it('should handle pagination correctly', async () => {
      const queryDto: QueryTaskDto = { page: 3, limit: 5 };
      const mockData = [mockTask];
      const mockTotal = 15;

      mockTypeOrmRepository.findAndCount.mockResolvedValue([mockData, mockTotal]);

      const result = await repository.findAll(queryDto);

      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 10, // (3-1) * 5
        take: 5,
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual({ data: mockData, total: mockTotal });
    });

    it('should use default pagination values', async () => {
      const queryDto: QueryTaskDto = {};
      const mockData = [mockTask];
      const mockTotal = 1;

      mockTypeOrmRepository.findAndCount.mockResolvedValue([mockData, mockTotal]);

      const result = await repository.findAll(queryDto);

      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0, // (1-1) * 10
        take: 10,
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual({ data: mockData, total: mockTotal });
    });
  });

  describe('findById', () => {
    it('should find a task by id', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';

      mockTypeOrmRepository.findOne.mockResolvedValue(mockTask);

      const result = await repository.findById(taskId);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(result).toEqual(mockTask);
    });

    it('should return null when task not found', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174999';

      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(taskId);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a task and return true when successful', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';

      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete(taskId);

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith(taskId);
      expect(result).toBe(true);
    });

    it('should return false when no task was deleted', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174999';

      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await repository.delete(taskId);

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith(taskId);
      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true when task exists', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';

      mockTypeOrmRepository.count.mockResolvedValue(1);

      const result = await repository.exists(taskId);

      expect(mockTypeOrmRepository.count).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(result).toBe(true);
    });

    it('should return false when task does not exist', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174999';

      mockTypeOrmRepository.count.mockResolvedValue(0);

      const result = await repository.exists(taskId);

      expect(mockTypeOrmRepository.count).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(result).toBe(false);
    });
  });

  describe('update method with null value filtering', () => {
    beforeEach(() => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockTask);
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 });
    });

    it('should filter out undefined values', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Updated Title',
        description: undefined,
        status: undefined,
      };

      await repository.update(mockTask.id, updateDto);

      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        mockTask.id,
        { title: 'Updated Title' } // undefined values filtered out
      );
    });

    it('should allow null for description field', async () => {
      const updateDto: UpdateTaskDto = {
        description: null,
      };

      await repository.update(mockTask.id, updateDto);

      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        mockTask.id,
        { description: null } // null allowed for description
      );
    });

    it('should filter out null values for non-description fields', async () => {
      const updateDto: UpdateTaskDto = {
        title: null as any, // Force null (should be filtered)
        description: 'Valid description',
        status: null as any, // Force null (should be filtered)
      };

      await repository.update(mockTask.id, updateDto);

      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        mockTask.id,
        { description: 'Valid description' } // null title and status filtered out
      );
    });

    it('should handle mixed null, undefined, and valid values correctly', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Valid Title',
        description: null, // Should be included (null allowed for description)
        status: undefined, // Should be filtered out
      };

      await repository.update(mockTask.id, updateDto);

      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        mockTask.id,
        {
          title: 'Valid Title',
          description: null,
        }
      );
    });

    it('should not call typeorm update when all values are filtered out', async () => {
      const updateDto: UpdateTaskDto = {
        title: undefined,
        description: undefined,
        status: undefined,
      };

      await repository.update(mockTask.id, updateDto);

      expect(typeOrmRepository.update).not.toHaveBeenCalled();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTask.id } });
    });

    it('should not call typeorm update when only invalid null values provided', async () => {
      const updateDto: UpdateTaskDto = {
        title: null as any, // Invalid null
        status: null as any, // Invalid null
      };

      await repository.update(mockTask.id, updateDto);

      expect(typeOrmRepository.update).not.toHaveBeenCalled();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTask.id } });
    });

    it('should handle empty update DTO', async () => {
      const updateDto: UpdateTaskDto = {};

      await repository.update(mockTask.id, updateDto);

      expect(typeOrmRepository.update).not.toHaveBeenCalled();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTask.id } });
    });

    it('should pass through valid enum values', async () => {
      const updateDto: UpdateTaskDto = {
        status: TaskStatus.DONE,
      };

      await repository.update(mockTask.id, updateDto);

      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        mockTask.id,
        { status: TaskStatus.DONE }
      );
    });

    it('should handle all valid fields together', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'New Title',
        description: 'New Description',
        status: TaskStatus.IN_PROGRESS,
      };

      await repository.update(mockTask.id, updateDto);

      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        mockTask.id,
        {
          title: 'New Title',
          description: 'New Description',
          status: TaskStatus.IN_PROGRESS,
        }
      );
    });

    it('should return the updated task after successful update', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Updated Title',
      };
      const updatedTask = { ...mockTask, title: 'Updated Title' };
      mockTypeOrmRepository.findOne.mockResolvedValue(updatedTask);

      const result = await repository.update(mockTask.id, updateDto);

      expect(result).toEqual(updatedTask);
      expect(typeOrmRepository.findOne).toHaveBeenCalledTimes(1); // Called after update
    });
  });
});
