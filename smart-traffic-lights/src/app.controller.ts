import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TimecalService } from './timecal/timecal.service';
import { TimecalDto, TimecalPredictDto } from './timecal/dto/timecal.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly timecalService: TimecalService) { }

  list_cam = [{
    id_cam: 1,
    id_street: 1,
    current_state: "red",
    current_time: 0,
    d1: 0.32,
    L1: 10,
  }
  ];

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/test')
  test(@Body() body: TimecalPredictDto) {
    let list_D2 = [0.15, 0.19, 0.18, 0, 0.21, 0.2, 0.21, 0.2, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6,]
    let list_D1 = [0.53, 0.53, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.15, 0.08, 0.12, 0.1, 0.13, 0.18, 0.24, 0.24, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.25, 0.24, 0.24, 0.9, 0.24, 0.24, 0.24, 0.24, 0.2, 0.24, 0.43, 0, 0.44, 0.37, 0.35, 0.32, 0.34, 0.9, 0.23, 0.6, 0.34, 0.9, 0.23, 0.6,]
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
    for (let i = 1; i < list_D1.length; i++) {
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
      let updateData: TimecalDto = {
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
      let t_update = this.timecalService.updateCurrentTime(updateData)
      time_range_limit = t_update.time_limit
      console.log(t_update)
      current_time_1 = t_update.time1
      current_time_2 = t_update.time2
      next_state_1 = this.timecalService.nextState(current_state_1, t_update.time1)
      next_state_2 = this.timecalService.nextState(current_state_2, t_update.time2)
      if (next_state_1 !== current_state_1 || next_state_2 !== current_state_2) {
        time_range_limit = 20
        let t = this.timecalService.calNextTime({
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

      res.push(this.timecalService.calPredictTime(data))

    }

    return res
  }



}
