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
import { GlobalService } from './global/global.service';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [AdafruitModule, AuthModule, PrismaModule, TrafficLightModule, CrossroadsModule, TimecalModule, ImageProcessorModule, GlobalModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, GlobalService],
})
export class AppModule {}
