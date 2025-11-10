import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Request, Response, json, urlencoded } from "express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { configService } from "./config/config.service";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define the route for the root path ("/") for ECS health check
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the NestJS API! v1.0");
  });

  // set global prefix for http
  app.setGlobalPrefix("api");

  // set request body size limit
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));

  // enable versioning for http
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: configService.isProduction()
      ? [/^https:\/\/([\w-]+\.)*getsolar\.ai$/]
      : ["http://localhost:3000"],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  });

  if (!configService.isProduction()) {
    const config = new DocumentBuilder()
      .setTitle("WMS API")
      .setDescription("WMS API")
      .setVersion("1.0")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
