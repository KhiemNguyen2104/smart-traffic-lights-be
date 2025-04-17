import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { TimecalDto, TimecalEvalDto, TimecalResponseDto } from './dto/timecal.dto';

@Injectable()
export class TimecalService {

    evalTraffic(D: number): TimecalEvalDto {
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
    calAnpha(dto: TimecalDto) {
        const rg = dto.D1 / (dto.D1 + dto.D2)
        const R = dto.L1 / (dto.L1 + dto.L2)
        if (dto.D1 > 0.35) {

        }

        return 0.5
    }

    // Thời gian đèn đỏ luôn lớn hơn đèn xanh tại 1 thời điểm bất kỳ mà 2 màu này cùng xuất hiện
    // vd đèn 1 đang xanh và 20s thì đèn 2 phải đỏ và 30s
    updateCurrentTime(dto: TimecalDto): TimecalResponseDto { // Hàm này sẽ trở về thời gian đèn: time1 là thời gian của đèn 1
        const rg = dto.D1 / (dto.D1 + dto.D2)
        const R = dto.L1 / (dto.L1 + dto.L2)

        const anpha = this.calAnpha(dto)
        const ratio = rg * anpha + (1 - anpha) * R;

        let trafficState1 = this.evalTraffic(dto.D1);
        let trafficState2 = this.evalTraffic(dto.D2);

        const range = dto.time_range_limit;
        const threadHold = 10;

        if (dto.D1 / Math.max(dto.old_D1, 0.1) >= 3//giao thong ben 1 tang dot ngot (tang dot ngot k co nghĩa là dày đặt, vd từ 0 lên 0.12 hoặc từ 0.04 lên 0.12)
            && dto.D2 / Math.max(dto.old_D2, 0.1) < 1.5 //giao thong ben 2 tang khong nhieu
            && !trafficState2.high //giao thong ben 2 đang không dày đặc
            && trafficState1.high //giao thong ben 1 đang dày đặc
        ) {
            if (dto.state_1 === "green") {
                const timeUsed = Math.min(range, ratio * dto.old_T1)
                return {
                    time1: dto.old_T1 + timeUsed,
                    time2: dto.old_T2 + timeUsed,
                    time_limit: range - timeUsed
                }
            } else if (dto.state_1 === "red" && dto.state_2 === "green") {
                const timeUsed = Math.min(range, ratio * dto.old_T1)
                if (dto.old_T1 - timeUsed < threadHold) //nếu mà cập nhật quá giới hạn ngưỡng
                    if (dto.old_T1 > threadHold) {
                        return {
                            time1: threadHold,
                            time2: dto.old_T2 + dto.old_T1 - threadHold,
                            time_limit: 0
                        }
                    } else {
                        return {
                            time1: dto.old_T1,
                            time2: dto.old_T2,
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
            time1: dto.old_D1,
            time2: dto.old_D2,
            time_limit: range
        }

    }
    async calNextTime(dto: TimecalDto) {

    }
}
