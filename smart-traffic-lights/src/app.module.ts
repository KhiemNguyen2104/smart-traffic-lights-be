import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdafruitModule } from './adafruit/adafruit.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrafficLightModule } from './traffic-light/traffic-light.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AdafruitModule, AuthModule, PrismaModule, TrafficLightModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
