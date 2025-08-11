import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTasksTable1700000000000 implements MigrationInterface {
  name = 'CreateTasksTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension for UUID generation
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create the tasks table
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['TO_DO', 'IN_PROGRESS', 'DONE'],
            default: "'TO_DO'",
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create index on status for better query performance
    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'IDX_tasks_status',
        columnNames: ['status'],
      }),
    );

    // Create index on created_at for better sorting performance
    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'IDX_tasks_created_at',
        columnNames: ['created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('tasks', 'IDX_tasks_created_at');
    await queryRunner.dropIndex('tasks', 'IDX_tasks_status');
    
    // Drop the tasks table
    await queryRunner.dropTable('tasks');
  }
}
