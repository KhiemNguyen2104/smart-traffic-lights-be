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


    time_range_limit: number
    total_time: number
}

export class TimecalResponseDto {
    time1: number
    time2: number
    time_limit: number
}
export class TimecalUpdateDto {


}
export class TimecalEvalDto {
    low: Boolean
    normal: Boolean
    high: Boolean
}