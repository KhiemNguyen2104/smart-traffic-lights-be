import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data'
import { readFile } from 'fs/promises';
import * as p from 'path'

@Injectable()
export class ImageProcessorService {
    private ngrokDomain = process.env.NGROK_DOMAIN;

    async featureDetect(buffer: string, filename: string) {

        const base64Data = buffer.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

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
