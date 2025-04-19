import { Module } from '@nestjs/common';
import { GlobalService } from './global.service';
import { AdafruitModule } from 'src/adafruit/adafruit.module';

@Module({
    exports: [GlobalService],
    providers: [GlobalService],
    imports: [AdafruitModule]
})
export class GlobalModule {}
