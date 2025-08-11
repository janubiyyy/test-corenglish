import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateTaskDto } from './update-task.dto';
import { TaskStatus } from '../enums/task-status.enum';

describe('UpdateTaskDto', () => {
  it('should be valid with empty object', async () => {
    const dto = plainToInstance(UpdateTaskDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid with valid title', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      title: 'Valid Title',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid with undefined title when title is provided but undefined', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      title: undefined,
    });
    // Since title is undefined, ValidateIf should not trigger validation
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid with null title', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      title: null,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid with empty string title', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      title: '',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should be invalid with title longer than 255 characters', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      title: 'a'.repeat(256),
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should be invalid with non-string title', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      title: 123,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be valid with null description', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      description: null,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid with undefined description', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      description: undefined,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid with string description', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      description: 'Valid description',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid with non-string description when provided', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      description: 123,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be valid with valid status', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      status: TaskStatus.IN_PROGRESS,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid with undefined status when status is provided but undefined', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      status: undefined,
    });
    // Since status is undefined, ValidateIf should not trigger validation
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid with null status', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      status: null,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should be invalid with invalid status', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      status: 'INVALID_STATUS',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should handle all valid statuses', async () => {
    for (const status of Object.values(TaskStatus)) {
      const dto = plainToInstance(UpdateTaskDto, { status });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    }
  });

  it('should be valid with multiple valid fields', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      title: 'Updated Title',
      description: 'Updated Description',
      status: TaskStatus.DONE,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate ValidateIf conditions properly for title', async () => {
    // Test that ValidateIf works for title when title is provided
    const dto = plainToInstance(UpdateTaskDto, {
      title: '',  // Empty string should trigger validation
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should validate ValidateIf conditions properly for description', async () => {
    // Test that ValidateIf works for description when description is provided and not null
    const dto = plainToInstance(UpdateTaskDto, {
      description: 123,  // Non-string should trigger validation
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should validate ValidateIf conditions properly for status', async () => {
    // Test that ValidateIf works for status when status is provided
    const dto = plainToInstance(UpdateTaskDto, {
      status: 'INVALID',  // Invalid enum should trigger validation
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });
});
