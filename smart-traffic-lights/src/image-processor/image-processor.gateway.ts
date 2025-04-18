import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ImageProcessorService } from './image-processor.service';
  import { writeFile } from 'fs/promises';
  import * as path from 'path';
  
  @WebSocketGateway({ cors: true })
  export class ImageGateway implements OnGatewayInit, OnGatewayConnection {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly processor: ImageProcessorService) {}
  
    afterInit() {
      console.log('🚀 WebSocket initialized');
    }
  
    handleConnection(client: Socket) {
      console.log('📡 New client connected:', client.id);
    }
  
    @SubscribeMessage('image')
    async handleImage(@MessageBody() data: { filename: string; buffer: string }) {
      try {
        const base64 = data.buffer.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64, 'base64');
        const imagePath = path.join(`../smart-traffic-lights/src/model/images`, data.filename);

        console.log(`Path: ${imagePath}`)
  
        await writeFile(imagePath, buffer);
  
        const count = await this.processor.featureDetect(imagePath);
  
        console.log(`Detected ${count} vehicles in ${data.filename}`);
  
        // Optional: emit response back to sender
        this.server.emit('vehicle_count', { filename: data.filename, count });
      } catch (err) {
        console.error('Error processing image:', err.message);
      }
    }
  }