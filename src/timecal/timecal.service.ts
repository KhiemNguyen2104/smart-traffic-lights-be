export class TimecalService {

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

    nextState(state: string, time: number): string {
        if (time <= 0) {
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
    updateCurrentTime(dto: any): {time1: number, time2: number, time_limit: number, updateFlag: boolean} { // Hàm này sẽ trở về thời gian đèn: time1 là thời gian của đèn 1
        dto.D1 = Math.max(dto.D1, 0.01)
        dto.D2 = Math.max(dto.D2, 0.01)

        const rg = dto.D1 / (dto.D1 + dto.D2)
        const R = dto.L1 / (dto.L1 + dto.L2)

        const anpha = this.calAnpha(dto)
        const ratio = rg * anpha + (1 - anpha) * R;

        let trafficState1 = this.evalTraffic(dto.D1);
        let trafficState2 = this.evalTraffic(dto.D2);

        const range = dto.time_range_limit
        const threadHold = 10;

        if (
            dto.D1 / Math.max(dto.old_D1, 0.1) >= 1.5       // giao thong ben 1 tang dot ngot (tang dot ngot k co nghĩa là dày đặt, vd từ 0 lên 0.12 hoặc từ 0.04 lên 0.12)
            && dto.D2 / Math.max(dto.old_D2, 0.1) < 1.5     // giao thong ben 2 tang khong nhieu
            && !trafficState2.high                          // giao thong ben 2 đang không dày đặc
            && trafficState1.high                           // giao thong ben 1 đang dày đặc
            && dto.isAuto
        ) {
            
            if (dto.state_1 === "green") {
                const timeUsed = Math.floor(Math.min(range, ratio * dto.old_T1))

                return {
                    time1: dto.old_T1 + timeUsed,
                    time2: dto.old_T2 + timeUsed,
                    time_limit: range - timeUsed,
                    updateFlag: true
                }
            } else if (dto.state_1 === "red" && dto.state_2 === "green") {
                const timeUsed = Math.floor(Math.min(range, ratio * dto.old_T1))

                if (dto.old_T2 - timeUsed < threadHold) { // nếu mà cập nhật quá giới hạn ngưỡng
                    if (dto.old_T2 > threadHold) {
                        return {
                            time1: dto.old_T1 - (dto.old_T2 - threadHold),
                            time2: threadHold,
                            time_limit: 0,
                            updateFlag: true
                        }
                    } else {
                        return {
                            time1: dto.old_T1 - 1,
                            time2: dto.old_T2 - 1,
                            time_limit: 0,
                            updateFlag: false
                        }
                    }
                }

                return {
                    time1: dto.old_T1 - timeUsed,
                    time2: dto.old_T2 - timeUsed,
                    time_limit: range - timeUsed,
                    updateFlag: true
                }
            }
        }
        // neu la den vang thi khong xu ly
        return {
            time1: dto.old_T1 - 1,
            time2: dto.old_T2 - 1,
            time_limit: range,
            updateFlag: false
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

        // console.log("GTIME: ", gTime)

        return Math.floor(gTime)
    }
}