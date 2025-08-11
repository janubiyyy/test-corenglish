# Task Management API

Made to complete the assessment at COREnglish.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
 - **Containerization**: Docker

## Setup with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-api
   ```

2. **Setup environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file if you need to customize database credentials or ports.

3. **Start the application with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Start PostgreSQL database on the selected port
   - Build and start the NestJS application on the selected port
   - Run database migrations automatically

4. **Access the application**
   - API: http://localhost:${PORT} (default: 3000)
   - Swagger Documentation: http://localhost:${PORT}/api (default: 3000)

## Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file if you need to customize database credentials or ports.

3. **Ensure database exists**
   Make sure your PostgreSQL database `task_management` is created manually before running migrations.

4. **Run database migrations**
   ```bash
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | Get all tasks (with filtering and pagination) |
| GET | `/tasks/:id` | Get a specific task by ID |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Testing

**Run unit tests:**
```bash
npm run test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run end-to-end tests:**
```bash
npm run test:e2e
```

**Run tests with coverage report:**
```bash
npm run test:cov
```

## Database Migrations

**Run all pending migrations:**
```bash
npm run migration:run
```

**Generate a new migration based on entity changes:**
```bash
npm run migration:generate -- src/migrations/MigrationName
```

**Create an empty migration file:**
```bash
npm run migration:create -- src/migrations/MigrationName
```

**Revert the last executed migration:**
```bash
npm run migration:revert
```

**Show migration status:**
```bash
npm run migration:show
```

## Project Structure

```
src/
├── config/
│   └── database.config.ts           # Database configuration with TypeORM setup
├── modules/
│   └── tasks/
│       ├── controllers/
│       │   ├── task.controller.ts    # REST API endpoints with Swagger documentation
│       │   └── task.controller.spec.ts # Controller unit tests
│       ├── services/
│       │   ├── task.service.ts       # Business logic layer
│       │   └── task.service.spec.ts  # Service unit tests
│       ├── repositories/
│       │   ├── task.repository.ts    # Data access layer with TypeORM
│       │   └── task.repository.spec.ts # Repository unit tests
│       ├── entities/
│       │   └── task.entity.ts        # TypeORM entity with validation
│       ├── dto/
│       │   ├── create-task.dto.ts    # Request DTO for creating tasks
│       │   ├── update-task.dto.ts    # Request DTO for updating tasks
│       │   ├── update-task.dto.spec.ts # Update DTO tests
│       │   ├── query-task.dto.ts     # Query parameters for filtering/pagination
│       │   ├── query-task.dto.spec.ts # Query DTO tests
│       │   └── paginated-task.dto.ts # Response DTO for paginated results
│       ├── enums/
│       │   └── task-status.enum.ts   # Task status enum (TO_DO, IN_PROGRESS, DONE)
│       └── task.module.ts            # NestJS module configuration
├── migrations/
│   └── 1700000000000-CreateTasksTable.ts # Initial database schema
├── main.ts                          # Application entry point with global pipes
└── app.module.ts                    # Root module with database connection

test/
├── task.e2e-spec.ts                # End-to-end integration tests
└── jest-e2e.json                   # E2E test configuration

# Additional Configuration Files
├── docker-compose.yml               # Multi-service Docker setup
├── Dockerfile                       # Application containerization
├── env.example                      # Environment variables template
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── nest-cli.json                    # NestJS CLI configuration
```

## DevOps Maintenance Challenge

Find the complete, detailed answers and examples here:

- [devops-challenge-submission/README.md](./devops-challenge-submission/README.md)
- Quick links:
  - [Task 1: System Health & Monitoring](./devops-challenge-submission/TASK_1_SYSTEM_HEALTH_MONITORING.md)
  - [Task 2: Database Maintenance & Backup](./devops-challenge-submission/TASK_2_DATABASE_MAINTENANCE.md)
  - [Task 3: Updates & Deployments](./devops-challenge-submission/TASK_3_UPDATES_DEPLOYMENTS.md)
  - [Task 4: Logging & Troubleshooting](./devops-challenge-submission/TASK_4_LOGGING_TROUBLESHOOTING.md)
  - [Task 5: Basic Security](./devops-challenge-submission/TASK_5_BASIC_SECURITY.md)
  - [Task 6: Simple CI/CD for a Dockerized Application](./devops-challenge-submission/TASK_6_CI_CD_PIPELINE.md)
  - Examples:
    - [PostgreSQL backup script](./devops-challenge-submission/examples/conceptual_postgres_backup.sh)
    - [MongoDB backup script](./devops-challenge-submission/examples/conceptual_mongodb_backup.sh)
    - [CI/CD pipeline sketch](./devops-challenge-submission/examples/conceptual_ci_cd_pipeline.yml)
