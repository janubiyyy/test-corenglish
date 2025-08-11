import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { QueryTaskDto } from './query-task.dto';
import { TaskStatus } from '../enums/task-status.enum';

describe('QueryTaskDto', () => {
  it('should be valid with all optional fields undefined', async () => {
    const dto = plainToInstance(QueryTaskDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.page).toBe(1); // default value
    expect(dto.limit).toBe(10); // default value
  });

  it('should be valid with valid status', async () => {
    const dto = plainToInstance(QueryTaskDto, {
      status: TaskStatus.TO_DO,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid with invalid status', async () => {
    const dto = plainToInstance(QueryTaskDto, {
      status: 'INVALID_STATUS',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should be valid with valid page and limit', async () => {
    const dto = plainToInstance(QueryTaskDto, {
      page: '2',
      limit: '20',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(20);
  });

  it('should be invalid with page less than 1', async () => {
    const dto = plainToInstance(QueryTaskDto, {
      page: '0',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('page');
  });

  it('should be invalid with limit greater than 100', async () => {
    const dto = plainToInstance(QueryTaskDto, {
      limit: '101',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should be invalid with non-integer page', async () => {
    const dto = plainToInstance(QueryTaskDto, {
      page: 'not-a-number',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('page');
  });

  it('should be invalid with non-integer limit', async () => {
    const dto = plainToInstance(QueryTaskDto, {
      limit: 'not-a-number',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should transform string numbers to integers', async () => {
    const dto = plainToInstance(QueryTaskDto, {
      page: '3',
      limit: '15',
    });
    expect(dto.page).toBe(3);
    expect(dto.limit).toBe(15);
  });

  it('should handle all valid statuses', async () => {
    for (const status of Object.values(TaskStatus)) {
      const dto = plainToInstance(QueryTaskDto, { status });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    }
  });
});
