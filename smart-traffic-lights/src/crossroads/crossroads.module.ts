import { Module } from '@nestjs/common';
import { CrossroadsService } from './crossroads.service';
import { CrossroadsController } from './crossroads.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdafruitModule } from 'src/adafruit/adafruit.module';

@Module({
  imports: [PrismaModule, AdafruitModule],
  providers: [CrossroadsService],
  controllers: [CrossroadsController],
})
export class CrossroadsModule {

}
