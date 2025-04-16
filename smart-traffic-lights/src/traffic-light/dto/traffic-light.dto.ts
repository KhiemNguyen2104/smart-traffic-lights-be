import { IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator'

export class AddTLDto {
    @IsString()
    @IsNotEmpty()
    tl_id: string

    @IsNumber()
    @IsNotEmpty()
    length: number

    @IsNumber()
    @IsNotEmpty()
    width: number

    @IsNumber()
    @IsNotEmpty()
    g_time: number

    @IsNumber()
    @IsNotEmpty()
    r_time: number
    
    @IsNumber()
    @IsNotEmpty()
    y_time: number

    @IsNumber()
    @IsNotEmpty()
    g_thres: number

    @IsNumber()
    @IsNotEmpty()
    r_thres: number
    
    @IsNumber()
    @IsNotEmpty()
    y_thres: number

    @IsString()
    @IsNotEmpty()
    green_feed: string

    @IsString()
    @IsNotEmpty()
    red_feed: string

    @IsString()
    @IsNotEmpty()
    yellow_feed: string
}

export class UpdateTLDto {
    @IsString()
    @IsNotEmpty()
    tl_id: string

    @IsOptional()
    @IsString()
    user_id?: string
    
    @IsOptional()
    @IsString()
    cr_id?: string

    @IsNumber()
    @IsNotEmpty()
    g_time: number

    @IsNumber()
    @IsNotEmpty()
    r_time: number
    
    @IsNumber()
    @IsOptional()
    y_time?: number

    @IsNumber()
    @IsOptional()
    g_thres?: number

    @IsNumber()
    @IsOptional()
    r_thres?: number
    
    @IsNumber()
    @IsOptional()
    y_thres?: number
}