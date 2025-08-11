import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { TaskRepository } from './repositories/task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService, TaskRepository],
})
export class TaskModule {}
