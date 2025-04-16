import { Module } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { TrafficLightController } from './traffic-light.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TrafficLightService],
  controllers: [TrafficLightController]
})
export class TrafficLightModule {}
