export class TimecalDto {
    D1: number
    D2: number
    L1: number
    L2: number

    old_D1: number
    old_D2: number
    old_T1: number // cái này là thời gian đang đếm của đèn
    old_T2: number // cái này là thời gian đang đếm của đèn

    state_1: String // "red", "yellow", "green"
    state_2: String // "red", "yellow", "green"


    time_range_limit: number // giới hạn cập nhât khi truyền cho hàm updateCurrentTime
    // total_time: number
}

export class TimecalResponseDto {
    time1: number
    time2: number
    time_limit: number
}
export class TimecalNextTimeDto {

    time_cal_stack: Array<number> // chứa chuỗi thời gian tính toán của đèn đang màu đỏ và sắp chuyển thành đèn xanh
    current_state_1: String // "red", "yellow", "green"
    // current_time_1: number
    current_state_2: String // "red", "yellow", "green"
    // current_time_2: number

}
export class TimecalEvalDto {
    low: Boolean
    normal: Boolean
    high: Boolean
}

export class TimecalPredictDto {
    D1: number
    D2: number
    L1: number
    L2: number

    state_1: String // "red", "yellow", "green"
    state_2: String // "red", "yellow", "green"


    time_range_limit_low: number
    time_range_limit_high: number
    init_time: number
}