import { Module } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { TrafficLightController } from './traffic-light.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdafruitModule } from 'src/adafruit/adafruit.module';

@Module({
  imports: [PrismaModule, AdafruitModule],
  providers: [TrafficLightService],
  controllers: [TrafficLightController]
})
export class TrafficLightModule {}
