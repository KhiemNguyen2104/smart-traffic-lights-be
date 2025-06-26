import { Injectable } from '@nestjs/common';
import { AdafruitService } from 'src/adafruit/adafruit.service';

@Injectable()
export class GlobalService {
    constructor(public adafruit: AdafruitService) {}
    static Densities: {cr_id: String, tl_id: String, time: Date, density: number}[] = []
}
