// import {
//     WebSocketGateway,
//     SubscribeMessage,
//     MessageBody,
//     OnGatewayConnection,
//     OnGatewayInit,
//     WebSocketServer,
//   } from '@nestjs/websockets';
//   import { Server, Socket } from 'socket.io';
//   import { ImageProcessorService } from './image-processor.service';
//   import { writeFile } from 'fs/promises';
//   import * as path from 'path';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { ForbiddenException } from '@nestjs/common';
// import { ERRORS } from 'src/common/errors';
// import { GlobalService } from 'src/global/global.service';
// import { App } from 'supertest/types';
  
//   @WebSocketGateway({ cors: true })
//   export class ImageGateway implements OnGatewayInit, OnGatewayConnection {
//     @WebSocketServer()
//     server: Server;
  
//     constructor(private readonly processor: ImageProcessorService, private prisma: PrismaService) {}
  
//     afterInit() {
//       console.log('🚀 WebSocket initialized');
//     }
  
//     handleConnection(client: Socket) {
//       console.log('📡 New client connected:', client.id);
//     }
  
//     @SubscribeMessage('image')
//     async handleImage(@MessageBody() data: { filename: string; buffer: string }) {
//       try {
//         const base64 = data.buffer.replace(/^data:image\/\w+;base64,/, '');
//         const buffer = Buffer.from(base64, 'base64');
//         const imagePath = path.join(`../smart-traffic-lights/src/model/images`, data.filename);

//         console.log(`Path: ${imagePath}`)
  
//         await writeFile(imagePath, buffer);

//         console.log("HELLO")
  
//         const count = await this.processor.featureDetect(imagePath);

//         console.log("dfdfdfdf2")

//         const infor = data.filename.split('_', 2)
//         const cr_id = infor[0]
//         const tl_id = infor[1]
//         const time = (new Date())

//         console.log("HELLO1123123122")

//         try {
//           // const traffic_light = await this.prisma.traffic_light.findUnique({
//           //   where: {
//           //     tl_id: tl_id
//           //   }
//           // })

//           // if (!traffic_light || !traffic_light.length || !traffic_light.width) {
//           //   throw new ForbiddenException(ERRORS.TRAFFIC_LIGHT_NOT_FOUND)
//           // }

//           // const density = count/(traffic_light.length * traffic_light.width)
//           const density = count/(15*7)

//           GlobalService.Densities.push({cr_id: cr_id, tl_id: tl_id, time: time, density: density})

//           console.log("Densities: ", GlobalService.Densities)

//         } catch (err) {
//           throw new ForbiddenException(ERRORS.TRAFFIC_LIGHT_NOT_FOUND + `: ${err}`)
//         }
  
//         console.log(`Detected ${count} vehicles in ${data.filename}`);
  
//         // Optional: emit response back to sender
//         this.server.emit('vehicle_count', { filename: data.filename, count });
//       } catch (err) {
//         console.error('Error processing image:', err.message);
//       }
//     }
//   }