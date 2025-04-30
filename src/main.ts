import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { Logger } from '@nestjs/common';
async function bootstrap() {
  // const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  // logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
