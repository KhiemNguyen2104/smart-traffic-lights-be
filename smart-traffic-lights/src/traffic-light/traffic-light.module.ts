import { Module } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { TrafficLightController } from './traffic-light.controller';

@Module({
  providers: [TrafficLightService],
  controllers: [TrafficLightController]
})
export class TrafficLightModule {}
