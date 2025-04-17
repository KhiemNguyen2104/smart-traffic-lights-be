import { Module } from '@nestjs/common';
import { CrossroadsService } from './crossroads.service';
import { CrossroadsController } from './crossroads.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CrossroadsService],
  controllers: [CrossroadsController],
})
export class CrossroadsModule {

}
