import { ApiProperty } from '@nestjs/swagger'
import { TLType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class AddTLDto {
    // @IsString()
    // @ApiProperty()
    // @IsNotEmpty()
    // tl_id: string

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    cr_id: string

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    length: number

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    width: number

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    g_time: number

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    r_time: number

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    y_time: number

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    g_thres: number

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    r_thres: number

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    y_thres: number

    // @IsString()
    // @ApiProperty()
    // @IsNotEmpty()
    // green_feed: string

    // @IsString()
    // @ApiProperty()
    // @IsNotEmpty()
    // red_feed: string

    // @IsString()
    // @ApiProperty()
    // @IsNotEmpty()
    // yellow_feed: string

    @IsEnum(TLType)
    @ApiProperty()
    @IsNotEmpty()
    type: TLType
}

export class UpdateTLDto {
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    tl_id: string

    @IsOptional()
    @ApiProperty()
    @IsString()
    user_id?: string

    @IsOptional()
    @ApiProperty()
    @IsString()
    cr_id?: string

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    g_time: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    r_time: number

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    y_time?: number

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    g_thres?: number

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    r_thres?: number

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    y_thres?: number
}