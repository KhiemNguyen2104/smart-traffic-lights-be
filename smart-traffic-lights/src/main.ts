import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: '*',// `http://localhost:${process.env.PORT}`, // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
    credentials: true, // Allow credentials like cookies
  });

  const config = new DocumentBuilder()
    .setTitle('Smart Traffic Lights')
    .setDescription('API descriptions')
    .setVersion('1.1')
    .addBearerAuth()
    .addTag('Authenticate')
    .addTag('Models')
    .addTag('Adafruit')
    .addTag('Traffic-lights')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true, // Optional: Keeps the token after refreshing the page
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`The application is ready at ${process.env.PORT}`)
}
bootstrap();
