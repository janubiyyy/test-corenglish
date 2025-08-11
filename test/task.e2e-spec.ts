import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TaskStatus } from '../src/modules/tasks/enums/task-status.enum';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Enable validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', () => {
      const createTaskDto = {
        title: 'E2E Test Task',
        description: 'This is a test task for e2e testing',
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createTaskDto.title);
          expect(res.body.description).toBe(createTaskDto.description);
          expect(res.body.status).toBe(TaskStatus.TO_DO);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          createdTaskId = res.body.id;
        });
    });

    it('should return 400 for invalid task data', () => {
      const invalidTaskDto = {
        title: '', // Empty title should fail validation
        description: 'Valid description',
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .send(invalidTaskDto)
        .expect(400);
    });

    it('should return 400 for task title that exceeds max length', () => {
      const invalidTaskDto = {
        title: 'a'.repeat(256), // Title longer than 255 characters
        description: 'Valid description',
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .send(invalidTaskDto)
        .expect(400);
    });
  });

  describe('/tasks (GET)', () => {
    it('should return all tasks with pagination', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(res.body).toHaveProperty('totalPages');
          expect(Array.isArray(res.body.data)).toBeTruthy();
        });
    });

    it('should filter tasks by status', () => {
      return request(app.getHttpServer())
        .get('/tasks?status=TO_DO')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.every((task: any) => task.status === TaskStatus.TO_DO)).toBeTruthy();
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/tasks?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe(1);
          expect(res.body.limit).toBe(5);
          expect(res.body.data.length).toBeLessThanOrEqual(5);
        });
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should return a specific task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdTaskId);
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('status');
        });
    });

    it('should return 404 for non-existent task', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      return request(app.getHttpServer())
        .get(`/tasks/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID format', () => {
      return request(app.getHttpServer())
        .get('/tasks/invalid-uuid')
        .expect(400);
    });
  });

  describe('/tasks/:id (PATCH)', () => {
    it('should update a task', () => {
      const updateTaskDto = {
        title: 'Updated E2E Test Task',
        status: TaskStatus.IN_PROGRESS,
      };

      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send(updateTaskDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdTaskId);
          expect(res.body.title).toBe(updateTaskDto.title);
          expect(res.body.status).toBe(updateTaskDto.status);
        });
    });

    it('should return 404 for non-existent task', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      const updateTaskDto = {
        title: 'Updated Task',
      };

      return request(app.getHttpServer())
        .patch(`/tasks/${nonExistentId}`)
        .send(updateTaskDto)
        .expect(404);
    });

    it('should return 400 for invalid status', () => {
      const updateTaskDto = {
        status: 'INVALID_STATUS',
      };

      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send(updateTaskDto)
        .expect(400);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete a task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .expect(204);
    });

    it('should return 404 when trying to delete non-existent task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID format', () => {
      return request(app.getHttpServer())
        .delete('/tasks/invalid-uuid')
        .expect(400);
    });
  });
});
