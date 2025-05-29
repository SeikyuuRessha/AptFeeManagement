import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { CustomValidationPipe } from "./common/pipes/custom-validation.pipe";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(
        new CustomValidationPipe({
            whitelist: true, // loai bo thuoc tinh khong co trong DTO
            transform: true, // convert kieu du lieu nhap vao sang dung kieu du lieu trong DTO
            forbidNonWhitelisted: true, // Throw error khi co properties ko co trong DTO
        })
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    const config = new DocumentBuilder()
        .setTitle("Quản Lý Thu Phí Chung Cư API")
        .setDescription("Tài liệu API cho ứng dụng Quản Lý Thu Phí Chung Cư")
        .setVersion("1.0")
        .addBearerAuth() // Thêm hỗ trợ xác thực Bearer Token nếu API của bạn có sử dụng
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document); // 'api-docs' là đường dẫn bạn sẽ truy cập Swagger UI
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
