import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Server } from 'socket.io';
import * as http from 'http';
import { GlobalService } from './global/global.service';
import { AdafruitService } from './adafruit/adafruit.service';
import { PublicDto } from './adafruit/dto';

class TimecalService {

  evalTraffic(D: number) {
    let low = false
    let normal = false
    let high = false
    if (0 <= D && D < 0.25) {
      low = true
    } else if (0.25 <= D && D < 0.35) {
      normal = true
    } else if (0.35 <= D) {
      high = true
    }
    return {
      low: low,
      normal: normal,
      high: high
    }
  }

  calTime(stack: Array<number>): number {
    let stack_length = stack.length
    if (stack_length === 0) {
      return 30
    }
    let p = Array<number>()
    let init = 0.5
    let space = 0.5
    let sum1 = 0
    let sum2 = 0
    for (let i = 0; i < stack_length; i++) {
      p.push(init)
      sum2 += init
      init = init + space
    }
    for (let i = 0; i < stack_length; i++) {
      sum1 += p[i] * stack[i]
    }
    return Math.floor(sum1 / sum2)
  }

  calAnpha(dto: any): number {
    const rg = dto.D1 / (dto.D1 + dto.D2)
    const R = dto.L1 / (dto.L1 + dto.L2)
    if (dto.D1 > 0.35) {

    }

    return 0.5
  }

  nextState(state: String, time: number): String {
    if (time <= 1) {
      if (state === "red") {
        return "green"
      } else if (state === "green") {
        return "yellow"
      } else if (state === "yellow") {
        return "red"
      }
    }
    return state
  }
  // Thời gian đèn đỏ luôn lớn hơn đèn xanh tại 1 thời điểm bất kỳ mà 2 màu này cùng xuất hiện
  // vd đèn 1 đang xanh và 20s thì đèn 2 phải đỏ và 30s
  updateCurrentTime(dto: any): any { // Hàm này sẽ trở về thời gian đèn: time1 là thời gian của đèn 1
    dto.D1 = Math.max(dto.D1, 0.01)
    dto.D2 = Math.max(dto.D2, 0.01)

    const rg = dto.D1 / (dto.D1 + dto.D2)
    const R = dto.L1 / (dto.L1 + dto.L2)

    const anpha = this.calAnpha(dto)
    const ratio = rg * anpha + (1 - anpha) * R;

    let trafficState1 = this.evalTraffic(dto.D1);
    let trafficState2 = this.evalTraffic(dto.D2);

    const range = dto.time_range_limit;
    const threadHold = 10;

    if (dto.D1 / Math.max(dto.old_D1, 0.1) >= 1.5//giao thong ben 1 tang dot ngot (tang dot ngot k co nghĩa là dày đặt, vd từ 0 lên 0.12 hoặc từ 0.04 lên 0.12)
      && dto.D2 / Math.max(dto.old_D2, 0.1) < 1.5 //giao thong ben 2 tang khong nhieu
      && !trafficState2.high //giao thong ben 2 đang không dày đặc
      && trafficState1.high //giao thong ben 1 đang dày đặc
    ) {
      if (dto.state_1 === "green") {
        const timeUsed = Math.floor(Math.min(range, ratio * dto.old_T1))
        return {
          time1: dto.old_T1 + timeUsed,
          time2: dto.old_T2 + timeUsed,
          time_limit: range - timeUsed
        }
      } else if (dto.state_1 === "red" && dto.state_2 === "green") {
        const timeUsed = Math.floor(Math.min(range, ratio * dto.old_T1))
        if (dto.old_T2 - timeUsed < threadHold) //nếu mà cập nhật quá giới hạn ngưỡng
          if (dto.old_T2 > threadHold) {
            return {
              time1: dto.old_T1 - (dto.old_T2 - threadHold),
              time2: threadHold,
              time_limit: 0
            }
          } else {
            return {
              time1: dto.old_T1 - 1,
              time2: dto.old_T2 - 1,
              time_limit: 0
            }
          }
        return {
          time1: dto.old_T1 - timeUsed,
          time2: dto.old_T2 - timeUsed,
          time_limit: range - timeUsed
        }
      }
    }
    //neu la den vang thi khong xu ly
    return {
      time1: dto.old_T1 - 1,
      time2: dto.old_T2 - 1,
      time_limit: range
    }

  }
  calNextTime(dto: any): { time1: number, time2: number, state_1: String, state_2: String } {
    let state_1_next;
    let state_2_next;
    let time1_next;
    let time2_next;
    const yellow_time = 5;
    if (dto.current_state_1 === "red") {
      if (dto.current_state_2 === "green") {
        state_1_next = "red"
        state_2_next = "yellow"
        time1_next = yellow_time
        time2_next = yellow_time
      } else if (dto.current_state_2 === "yellow") {
        state_1_next = "green"
        state_2_next = "red"
        time1_next = this.calTime(dto.time_cal_stack)
        time2_next = time1_next + yellow_time
      }
    } else if (dto.current_state_1 === "yellow") {
      state_1_next = "red"
      state_2_next = "green"
      time2_next = this.calTime(dto.time_cal_stack)
      time1_next = time2_next + yellow_time
    } else { // 1 green -> yellow , 2 red - > red
      state_1_next = "yellow"
      state_2_next = "red"
      time1_next = yellow_time
      time2_next = yellow_time
    }

    return {
      time1: time1_next,
      time2: time2_next,
      state_1: state_1_next,
      state_2: state_2_next
    }
  }
  calPredictTime(dto: any): number {
    let gTime
    dto.D1 = Math.max(dto.D1, 0.01)
    dto.D2 = Math.max(dto.D2, 0.01)
    if (dto.state_1 === "red") {
      const rg = dto.D1 / (dto.D1 + dto.D2)
      const R = dto.L1 / (dto.L1 + dto.L2)

      const anpha = this.calAnpha(dto)
      const ratio = rg * anpha + (1 - anpha) * R;

      gTime = Math.max(dto.time_range_limit_low, Math.min(dto.time_range_limit_high, ratio * dto.init_time))
    }
    if (dto.state_2 === "red") {
      const rg = dto.D2 / (dto.D1 + dto.D2)
      const R = dto.L2 / (dto.L1 + dto.L2)
      const data = {
        D1: dto.D2,
        D2: dto.D1,
        L1: dto.L2,
        L2: dto.L1,

        state_1: dto.state_2,
        state_2: dto.state_1,

        time_range_limit_low: dto.time_range_limit_low,
        time_range_limit_high: dto.time_range_limit_high,
        init_time: dto.init_time
      }

      const anpha = this.calAnpha(data)
      const ratio = rg * anpha + (1 - anpha) * R;
      gTime = Math.max(dto.time_range_limit_low, Math.min(dto.time_range_limit_high, ratio * dto.init_time))
    }
    return Math.floor(gTime)
  }
}

let timecalService = new TimecalService()

// let list_D2 = [0.15, 0.19, 0.18, 0, 0.21, 0.2, 0.21, 0.2, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6, 0.15, 0.19, 0.18, 0, 0.21, 0.2, 0.21, 0.2, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6]
let list_D2 = [0.15]
// let list_D1 = [0.53, 0.53, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.15, 0.08, 0.12, 0.1, 0.13, 0.18, 0.24, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.9, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6, 0.15, 0.19, 0.18, 0, 0.21, 0.2, 0.21, 0.2, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6]
let list_D1 = [0.53]
let L2 = 10
let L1 = 15

const time_range_limit_low = 10
const time_range_limit_high = 100
const init_time = 60
let time_range_limit = 20


let res = Array<number>()
let list_update = Array<number>()
let current_state_1: String = "red";
let current_state_2: String = "yellow";
let next_state_1: String = "red";
let next_state_2: String = "yellow";
let current_time_1 = 2
let current_time_2 = 2



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

  const server = http.createServer(app.getHttpAdapter().getInstance());

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  let list_clients = Array<any>();
  // Example socket event
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    list_clients.push(socket.id, socket);
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      list_clients = list_clients.filter((client) => client !== socket.id);
    });
  });

  const adafruit = app.get(AdafruitService)

  console.log('List clients: ', list_clients);
  let i = 1;
  let j = 0
  setInterval(() => {

    let dens = GlobalService.Densities
    let t1_count = 0;
    let t2_count = 0;

    while (dens.length > 0 && j < dens.length) {
      let temp = dens[j]
      if (t1_count == 1 && temp.tl_id != "2") {
        list_D2.push(list_D2[list_D2.length - 1])
        break;
      }
      else if (t2_count == 1 && temp.tl_id != "1") {
        list_D1.push(list_D1[list_D1.length - 1])
        break;
      }

      if (temp.tl_id == "1") {
        list_D1.push(temp.density)
        t1_count++;
        dens = dens.filter((item, index) => { index > 0 })
      } else {
        list_D2.push(temp.density)
        t2_count++;
        dens = dens.filter((item, index) => { index > 0 })
      }
      ++j;
    }

    console.log("D1: ", list_D1)
    console.log("D2: ", list_D2)

    let data = {
      D1: list_D1[i],
      D2: list_D2[i],
      L1: L1,
      L2: L2,

      state_1: current_state_1,
      state_2: current_state_2,

      time_range_limit_low: time_range_limit_low,
      time_range_limit_high: time_range_limit_high,
      init_time: init_time
    }
    let updateData = {
      D1: list_D1[i],
      D2: list_D2[i],
      L1: L1,
      L2: L2,

      old_D1: list_D1[i - 1],
      old_D2: list_D2[i - 1],
      old_T1: current_time_1,
      old_T2: current_time_2,

      state_1: current_state_1,
      state_2: current_state_2,

      time_range_limit: time_range_limit,
      // total_time: time_range_limit
    }
    let t_update = timecalService.updateCurrentTime(updateData)
    time_range_limit = t_update.time_limit
    console.log(t_update)
    current_time_1 = t_update.time1
    current_time_2 = t_update.time2
    next_state_1 = timecalService.nextState(current_state_1, t_update.time1)
    next_state_2 = timecalService.nextState(current_state_2, t_update.time2)
    if (next_state_1 !== current_state_1 || next_state_2 !== current_state_2) {
      time_range_limit = 20
      let t = timecalService.calNextTime({
        current_state_1: current_state_1,
        current_state_2: current_state_2,
        time_cal_stack: res
      })
      current_time_1 = t.time1
      current_time_2 = t.time2
      console.log(t)
      current_state_1 = next_state_1
      current_state_2 = next_state_2
      res = []
    }
    res.push(timecalService.calPredictTime(data))

    i++;


    const send_data = {
      message: 'Real-time traffic lights update',
      timestamp: new Date().toISOString(),
      data: [
        { cr_id: 1, tl_id: 1, status: current_state_1, current_time: current_time_1, density: list_D1[i], vehicles: 121 },
        { cr_id: 1, tl_id: 2, status: current_state_2, current_time: current_time_2, density: list_D2[i], vehicles: 121 },
      ]
    };
    if (i > list_D1.length - 1) {
      i = list_D1.length - 1
    }
    io.emit('traffic_lights', send_data); // Sends to all connected clients
    // console.log('Broadcasted traffic_lights to all clients:', data);

    // adafruit.publishData(new PublicDto({ state_feed: 'Test', time_feed: 'time', state: current_state_1 + '', time: current_time_1 + '' }))
  }, 5000);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`The application is ready at ${process.env.PORT}`)
  server.listen(process.env.PORT ? +process.env.PORT + 1 : 4001, () => {
    console.log(`Server and WebSocket running at http://localhost:${process.env.PORT ? +process.env.PORT + 1 : 4001}`);
  });
}
bootstrap();
