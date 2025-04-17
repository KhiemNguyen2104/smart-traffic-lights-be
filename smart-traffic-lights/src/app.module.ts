import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdafruitModule } from './adafruit/adafruit.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrafficLightModule } from './traffic-light/traffic-light.module';
import { PrismaService } from './prisma/prisma.service';
import { CrossroadsModule } from './crossroads/crossroads.module';
import { TimecalModule } from './timecal/timecal.module';
import { ImageProcessorModule } from './image-processor/image-processor.module';

@Module({
  imports: [AdafruitModule, AuthModule, PrismaModule, TrafficLightModule, CrossroadsModule, TimecalModule, ImageProcessorModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
