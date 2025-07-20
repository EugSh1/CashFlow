import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: "http://localhost:3000",
        credentials: true
    });
    app.use(helmet());
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    const swaggerConfig = new DocumentBuilder()
        .setTitle("CashFlow")
        .setDescription("Simple but powerful expense tracker")
        .setVersion("1.0")
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("swagger", app, documentFactory, {
        jsonDocumentUrl: "swagger/json"
    });

    await app.listen(process.env.PORT ?? 4200);
}

void bootstrap();
