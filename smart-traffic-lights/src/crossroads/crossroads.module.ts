import { Module } from '@nestjs/common';
import { CrossroadsService } from './crossroads.service';
import { CrossroadsController } from './crossroads.controller';

@Module({
  providers: [CrossroadsService],
  controllers: [CrossroadsController]
})
export class CrossroadsModule {
    
}
