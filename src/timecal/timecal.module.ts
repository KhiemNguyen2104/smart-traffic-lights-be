import { Module } from '@nestjs/common';
import { TimecalService } from './timecal.service';

@Module({
  providers: [TimecalService],
  exports: [TimecalService]
})
export class TimecalModule {}
