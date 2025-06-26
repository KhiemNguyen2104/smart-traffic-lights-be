import { ForbiddenException } from "@nestjs/common";
import { Server } from "socket.io";
import { AdafruitService } from "src/adafruit/adafruit.service";
import { PublicDto } from "src/adafruit/dto";
import { ERRORS } from "src/common/errors";
import { PrismaService } from "src/prisma/prisma.service";
import { TimecalService } from "src/timecal/timecal.service";

export class TrafficState {
  density: number[]
  time: number
  state: string

  constructor(partial?: Partial<TrafficState>) {
    Object.assign(this, partial);
  }
}

export class CrossroadsListener {
  private interval: ReturnType<typeof setInterval>;
  private trafficData: TrafficState[] = [];
  // private alpha: number = 2.5;
  // private stepCount: number = 0;
  private currentState1: string = ""
  private totalTime: number = 60
  private currentState2: string = ""
  private L1: number
  private L2: number
  private currentTime1: number
  private currentTime2: number
  private jump_limit: number
  private stack: number[] = []
  public isAuto: boolean = true
  private defaultTime1: number
  private defaultTime2: number

  constructor(
    private readonly adafruitService: AdafruitService,
    private readonly io: Server,
    public readonly crossroadId: string,
    private readonly timecalService: TimecalService,
    private prisma: PrismaService
  ) {
    timecalService = new TimecalService()
  }

  public async start() {
    // console.log("AUTO: ", this.isAuto)
    
    const crossroads = await this.prisma.crossroads.findUnique({
      where: {
        cr_id: this.crossroadId
      }
    })

    if (!crossroads) {
      throw new ForbiddenException(ERRORS.CROSSROADS_NOT_FOUND)
    }

    this.L1 = crossroads.L1
    this.L2 = crossroads.L2
    this.totalTime = crossroads.phase_time

    this.initDefault()

    this.interval = setInterval(async () => {
      console.log(`In crossroads: ${this.crossroadId}`)
      console.log("======================================================================\n")

      console.log("D1: ", this.trafficData[0].density)
      console.log("D2: ", this.trafficData[1].density)
      console.log("D3: ", this.trafficData[2].density)
      console.log("D4: ", this.trafficData[3].density)

      const result = this.processNextPhase();

      const d = [
        { cr_id: parseInt(this.crossroadId.split('-')[1]), tl_id: 1, status: this.currentState1, current_time: this.currentTime1, density: this.trafficData[0].density[0], vehicles: 25 },
        { cr_id: parseInt(this.crossroadId.split('-')[1]), tl_id: 2, status: this.currentState2, current_time: this.currentTime2, density: this.trafficData[1].density[0], vehicles: 35 },
        { cr_id: parseInt(this.crossroadId.split('-')[1]), tl_id: 3, status: this.currentState1, current_time: this.currentTime1, density: this.trafficData[2].density[0], vehicles: 27 },
        { cr_id: parseInt(this.crossroadId.split('-')[1]), tl_id: 4, status: this.currentState2, current_time: this.currentTime2, density: this.trafficData[3].density[0], vehicles: 31 },
      ]

      const send_data = {
        message: 'Real-time traffic lights update',
        timestamp: new Date().toISOString(),
        data: d
      }

      // console.log("Data sent to FE: ", d)

      if (result) {
        let time

        if (this.isAuto) {
          time = this.currentTime1 + ''
        } else {
          if (this.currentState1 = 'green') {
            time = this.defaultTime1 + ''
          } else if (this.currentState1 == 'red') {
            time = this.defaultTime2 + ''
          } else {
            time = this.currentTime1 + '';
          }
        }
        
        const data1 = new PublicDto({
          group: this.crossroadId,
          state: this.currentState1,
          state_feed: `state-1`,
          time: time,
          time_feed: `time-1`,
          density: this.trafficData[0].density[0] + '',
          dens_feed: 'dens-1'
        })

        // const data2 = new PublicDto({
        //   group: this.crossroadId,
        //   state: this.currentState2,
        //   state_feed: `state-2`,
        //   time: this.currentTime2 + '',
        //   time_feed: `time-2`
        // })

        // const data3 = new PublicDto({
        //   group: this.crossroadId,
        //   state: this.currentState1,
        //   state_feed: `state-1`,
        //   time: this.currentTime1 + '',
        //   time_feed: `time-1`
        // })

        // const data4 = new PublicDto({
        //   group: this.crossroadId,
        //   state: this.currentState2,
        //   state_feed: `state-2`,
        //   time: this.currentTime2 + '',
        //   time_feed: `time-2`
        // })



        await this.adafruitService.publishData(data1);
        // await this.adafruitService.publishData(data2);
        // await this.adafruitService.publishData(data3);
        // await this.adafruitService.publishData(data4);

        if (this.currentState1 != 'yellow' && this.currentState2 != 'yellow') {
          for (let i = 0; i < 4; i++) {
            this.trafficData[i].density = [this.trafficData[i].density[0]]
          }
          this.stack = [this.stack[0]]
          this.jump_limit = 20;
        }
      }
      this.io.emit('traffic_lights', send_data);
      // setInterval(() => {this.io.emit('traffic_lights', send_data);}, 1000)
    }, 1000);
  }

  public updateDensity(trafficLightId: string, density: number) {
    const id = parseInt(trafficLightId.split('-')[1]) - 1

    console.log("Traffic light ID: ", id)

    if (this.trafficData[id]) {
      this.trafficData[id].density = [density].concat(this.trafficData[id].density)

      if (id == 3) {
        this.trafficData[1].density = [this.trafficData[1].density[0]].concat(this.trafficData[1].density)
      } else if (id == 2) {
        this.trafficData[0].density = [this.trafficData[0].density[0]].concat(this.trafficData[0].density)
      } else {
        this.trafficData[id + 2].density = [this.trafficData[id + 2].density[0]].concat(this.trafficData[id + 2].density)
      }

    } else {
      throw new ForbiddenException(ERRORS.TRAFFIC_LIGHT_NOT_FOUND)
    }
  }

  stop() {
    clearInterval(this.interval);
  }

  private initDefault() {
    const greenTime = Math.floor((this.totalTime - 3) / 2)
    const data1 = { density: [0.1], time: greenTime, state: 'green' }
    const data2 = { density: [0.1], time: 5 + greenTime, state: 'green' }

    this.defaultTime1 = data1.time
    this.defaultTime2 = data2.time

    for (let i = 0; i < 4; i++) {
      if (i % 2 == 1) this.trafficData.push(new TrafficState(data1))
      else this.trafficData.push(new TrafficState(data2))
    }

    this.currentState1 = 'green'
    this.currentState2 = 'red'
    this.currentTime1 = greenTime
    this.currentTime2 = 5 + greenTime
    this.jump_limit = 20
    this.stack.push(greenTime)

    console.log("Init Stack: ", this.stack)

    this.adafruitService.publishData(new PublicDto({
      group: this.crossroadId,
      time: greenTime + '',
      time_feed: 'time-1',
      state: 'green',
      state_feed: 'state-1',
      density: '0.1',
      dens_feed: 'dens-1'
    }))
  }

  private processNextPhase(): boolean {
    let updateFlag = false;

    let data = {
      D1: (this.trafficData[0].density[0] + this.trafficData[2].density[0]) / 2,
      D2: (this.trafficData[1].density[0] + this.trafficData[3].density[0]) / 2,
      L1: this.L1,
      L2: this.L2,

      state_1: this.currentState1,
      state_2: this.currentState2,

      time_range_limit_low: 20,
      time_range_limit_high: 100,
      init_time: this.totalTime
    }
    let updateData = {
      D1: (this.trafficData[0].density[0] + this.trafficData[2].density[0]) / 2,
      D2: (this.trafficData[1].density[0] + this.trafficData[3].density[0]) / 2,
      L1: this.L1,
      L2: this.L2,

      old_D1: this.trafficData[0].density.length > 1 ? (this.trafficData[0].density[1] + this.trafficData[2].density[1]) / 2 : (this.trafficData[0].density[0] + this.trafficData[2].density[0]) / 2,
      old_D2: this.trafficData[0].density.length > 1 ? (this.trafficData[1].density[1] + this.trafficData[3].density[1]) / 2 : (this.trafficData[1].density[0] + this.trafficData[3].density[0]) / 2,
      old_T1: this.currentTime1,
      old_T2: this.currentTime2,

      state_1: this.currentState1,
      state_2: this.currentState2,

      time_range_limit: this.jump_limit,
      isAuto: this.isAuto
      // total_time: time_range_limit
    }

    let t_update = this.timecalService.updateCurrentTime(updateData)

    console.log(`Updated:`, t_update)

    this.currentTime1 = t_update.time1
    this.currentTime2 = t_update.time2
    this.jump_limit = t_update.time_limit
    updateFlag = t_update.updateFlag

    const next_state_1 = this.timecalService.nextState(this.currentState1, t_update.time1)
    const next_state_2 = this.timecalService.nextState(this.currentState2, t_update.time2)

    console.log(`Current state 1: ${this.currentState1}`)
    console.log(`Current state 2: ${this.currentState2}`)

    console.log(`Next state 1: ${next_state_1}`)
    console.log(`Next state 2: ${next_state_2}`)

    if (next_state_1 !== this.currentState1 || next_state_2 !== this.currentState2) {
      let t = this.timecalService.calNextTime({
        current_state_1: this.currentState1,
        current_state_2: this.currentState2,
        time_cal_stack: this.stack
      })

      console.log(`Start a new phase with`, t)

      if (this.isAuto) {
        this.currentTime1 = t.time1
        this.currentTime2 = t.time2
      } else {
        if (next_state_1 != 'yellow' && next_state_2 != 'yellow') {
          this.currentTime1 = next_state_1 == 'green' ? this.defaultTime1 : this.defaultTime2
          this.currentTime2 = next_state_2 == 'green' ? this.defaultTime1 : this.defaultTime2
        } else {
          this.currentTime1 = t.time1
          this.currentTime2 = t.time2
        }
      }

      this.currentState1 = next_state_1
      this.currentState2 = next_state_2

      // if (next_state_1 != 'yellow' && next_state_2 != 'yellow') {
      //   this.jump_limit = 20
      //   this.stack = [this.stack[0]]
      // }

      updateFlag = true
    }

    console.log("Data for time calculating: ", data)

    this.stack = [this.timecalService.calPredictTime(data)].concat(this.stack)

    console.log(`Stack: `, this.stack)

    this.trafficData[0].time = this.currentTime1
    this.trafficData[0].state = this.currentState1
    this.trafficData[2].time = this.currentTime1
    this.trafficData[2].state = this.currentState1

    this.trafficData[1].time = this.currentTime2
    this.trafficData[1].state = this.currentState2
    this.trafficData[3].time = this.currentTime2
    this.trafficData[3].state = this.currentState2

    return updateFlag
  }
}