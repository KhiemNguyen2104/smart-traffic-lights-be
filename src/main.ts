import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ForbiddenException, ValidationPipe } from '@nestjs/common';
import { Server } from 'socket.io';
import * as http from 'http';
import { TimecalService } from './timecal/timecal.service';
import { ImageProcessorService } from './image-processor/image-processor.service';
import { PrismaService } from './prisma/prisma.service';
import { CrossroadsListener } from './crosscroad-listener';
import { AdafruitService } from './adafruit/adafruit.service';

// let list_D2 = [0.15, 0.19, 0.18, 0, 0.21, 0.2, 0.21, 0.2, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6, 0.15, 0.19, 0.18, 0, 0.21, 0.2, 0.21, 0.2, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6]
// let list_D2 = [0.15]
// // let list_D1 = [0.53, 0.53, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.15, 0.08, 0.12, 0.1, 0.13, 0.18, 0.24, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.9, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6, 0.15, 0.19, 0.18, 0, 0.21, 0.2, 0.21, 0.2, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6]
// let list_D1 = [0.53]
// let L2 = 10
// let L1 = 15

// const time_range_limit_low = 10
// const time_range_limit_high = 100
// const init_time = 60
// let time_range_limit = 20


// let res = Array<number>()
// let list_update = Array<number>()
// let current_state_1: string = "red";
// let current_state_2: string = "yellow";
// let next_state_1: string = "red";
// let next_state_2: string = "yellow";
// let current_time_1 = 2
// let current_time_2 = 2

// const server = http.createServer();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: '*',// `http://localhost:${process.env.PORT}`, // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
    credentials: true, // Allow credentials like cookies
  });

  const config = new DocumentBuilder()
    .setTitle('Smart Traffic Lights')
    .setDescription('API descriptions')
    .setVersion('1.1')
    .addBearerAuth()
    .addTag('Authenticate')
    .addTag('Models')
    .addTag('Adafruit')
    .addTag('Traffic-lights')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true, // Optional: Keeps the token after refreshing the page
    },
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(`The application is ready at ${process.env.PORT}`)

  // ========================== REAL TIME DATA MANAGEMENT BY SOCKETS =============================

  const timecalService = new TimecalService()
  const imageProcessor = app.get(ImageProcessorService)
  const prisma = app.get(PrismaService)
  let crossroads: CrossroadsListener[] = []

  const noCR = await prisma.crossroads.count()
 
  const server = http.createServer(app.getHttpAdapter().getInstance());

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  for (let i = 1; i <= noCR; i++) {
    crossroads.push(
      new CrossroadsListener(
        app.get(AdafruitService),
        io,
        `cr-${i}`,
        timecalService,
        prisma
      )
    )

    crossroads[i - 1].start()
  }

  let list_clients = Array<any>();
  // Example socket event
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    list_clients.push(socket.id, socket);

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      list_clients = list_clients.filter((client) => client !== socket.id);
    });

    socket.on('change-auto-mode', (data) => {
      console.log("CHANGE IN: ", data)
      const cr = crossroads.filter(x => x.crossroadId == 'cr-' + data.cr_id)[0]
      if (data.state == "OFF") {
        cr.isAuto = false
      } else {
        cr.isAuto = true
      }
    });

    socket.on('image-sending', async (data: { filename: string; buffer: string }) => {
      try {
        console.log("Image receiving!")

        const { filename, buffer } = data

        const [crossroad_id, traffic_light_id, t] = filename.split('.')[0].split('_');

        io.emit('send-image', {cr_id: crossroad_id.split('-')[1], tl_id: traffic_light_id.split('-')[1], image: buffer})

        // console.log(`Crossroads: ${crossroad_id}.`)
        // console.log(`Traffic light: ${traffic_light_id}.`)
        console.log(`Time: ${t}.`)

        const vehicle_number = await imageProcessor.featureDetect(buffer, filename)

        console.log(`In Crossroads ${crossroad_id}, Light ${traffic_light_id}: Number of vehicles: `, vehicle_number)
        // console.log(`In Crossroads ${crossroad_id}, Light ${traffic_light_id}: Number of vehicles: `)

        const tl = await prisma.traffic_light.findUnique({
          where: {
            tl_id_cr_id: {
              tl_id: traffic_light_id,
              cr_id: crossroad_id
            }
          }
        })

        let density = 0.1

        if (tl) {
          density = vehicle_number/(tl.length * tl.width)
        }

        crossroads[parseInt(crossroad_id.split('-')[1]) - 1].updateDensity(traffic_light_id, density)

      } catch (err) {
        throw new ForbiddenException(err.message)
      }
    })
  });

  // const adafruit = app.get(AdafruitService)

  // console.log('List clients: ', list_clients);
  // let i = 1;
  // let j = 0
  // setInterval(() => {

  //   let dens = GlobalService.Densities
  //   let t1_count = 0;
  //   let t2_count = 0;

  //   while (dens.length > 0 && j < dens.length) {
  //     let temp = dens[j]
  //     if (t1_count == 1 && temp.tl_id != "2") {
  //       list_D2.push(list_D2[list_D2.length - 1])
  //       break;
  //     }
  //     else if (t2_count == 1 && temp.tl_id != "1") {
  //       list_D1.push(list_D1[list_D1.length - 1])
  //       break;
  //     }

  //     if (temp.tl_id == "1") {
  //       list_D1.push(temp.density)
  //       t1_count++;
  //       dens = dens.filter((item, index) => { index > 0 })
  //     } else {
  //       list_D2.push(temp.density)
  //       t2_count++;
  //       dens = dens.filter((item, index) => { index > 0 })
  //     }
  //     ++j;
  //   }

  //   console.log("D1: ", list_D1)
  //   console.log("D2: ", list_D2)

  //   let data = {
  //     D1: list_D1[i],
  //     D2: list_D2[i],
  //     L1: L1,
  //     L2: L2,

  //     state_1: current_state_1,
  //     state_2: current_state_2,

  //     time_range_limit_low: time_range_limit_low,
  //     time_range_limit_high: time_range_limit_high,
  //     init_time: init_time
  //   }
  //   let updateData = {
  //     D1: list_D1[i],
  //     D2: list_D2[i],
  //     L1: L1,
  //     L2: L2,

  //     old_D1: list_D1[i - 1],
  //     old_D2: list_D2[i - 1],
  //     old_T1: current_time_1,
  //     old_T2: current_time_2,

  //     state_1: current_state_1,
  //     state_2: current_state_2,

  //     time_range_limit: 20,
  //     // total_time: time_range_limit
  //   }
  //   let t_update = timecalService.updateCurrentTime(updateData)
  //   time_range_limit = t_update.time_limit
  //   console.log(t_update)
  //   current_time_1 = t_update.time1
  //   current_time_2 = t_update.time2
  //   next_state_1 = timecalService.nextState(current_state_1, t_update.time1)
  //   next_state_2 = timecalService.nextState(current_state_2, t_update.time2)
  //   if (next_state_1 !== current_state_1 || next_state_2 !== current_state_2) {
  //     time_range_limit = 20
  //     let t = timecalService.calNextTime({
  //       current_state_1: current_state_1,
  //       current_state_2: current_state_2,
  //       time_cal_stack: res
  //     })
  //     current_time_1 = t.time1
  //     current_time_2 = t.time2
  //     console.log(t)
  //     current_state_1 = next_state_1
  //     current_state_2 = next_state_2
  //     res = []
  //   }
  //   res.push(timecalService.calPredictTime(data))

  //   i++;


  //   const send_data = {
      // message: 'Real-time traffic lights update',
      // timestamp: new Date().toISOString(),
      // data: [
      //   { cr_id: 1, tl_id: 1, status: current_state_1, current_time: current_time_1, density: list_D1[i], vehicles: 121 },
      //   { cr_id: 1, tl_id: 2, status: current_state_2, current_time: current_time_2, density: list_D2[i], vehicles: 121 },
      // ]
  //   };
  //   if (i > list_D1.length - 1) {
  //     i = list_D1.length - 1
  //   }
  //   io.emit('traffic_lights', send_data); // Sends to all connected clients
  //   // console.log('Broadcasted traffic_lights to all clients:', data);

  //   // adafruit.publishData(new PublicDto({ state_feed: 'Test', time_feed: 'time', state: current_state_1 + '', time: current_time_1 + '' }))
  // }, 5000);

  server.listen(process.env.PORT ? +process.env.PORT + 1 : 4001, () => {
    console.log(`Server and WebSocket running at http://localhost:${process.env.PORT ? +process.env.PORT + 1 : 4001}`);
  });
}

bootstrap();