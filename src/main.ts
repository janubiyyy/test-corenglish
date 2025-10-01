"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Task Management API')
        .setDescription('A RESTful API for managing tasks')
        .setVersion('1.0')
        .addTag('tasks')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = configService.get('PORT', 3000);
    const host = configService.get('HOST', 'localhost');
    await app.listen(port, host);
    console.log(`Application is running on: http://${host}:${port}`);
    console.log(`Swagger documentation is available at: http://${host}:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map