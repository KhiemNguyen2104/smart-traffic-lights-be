import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data'
import { readFile } from 'fs/promises';
import * as p from 'path'

@Injectable()
export class ImageProcessorService {
    private ngrokDomain = process.env.NGROK_DOMAIN;

    async featureDetect(path: string) {
        const imageBuffer = await readFile(path); // 🔁 read image from disk
        const filename = p.basename(path);     // get filename like "car.jpg"

        const form = new FormData();
        form.append('image', imageBuffer, filename);

        const response = await axios.post(
            `${this.ngrokDomain}/count`,
            form,
            { headers: form.getHeaders() },
        );

        console.log(response.data.vehicle_count)

        return response.data.vehicle_count
    }
}
