import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PublicDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    green_feed: string

    @Transform(({ value }) => value.toString())
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    g_time: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    red_feed: string

    @Transform(({ value }) => value.toString())
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    r_time: string

    @IsString()
    @ApiProperty()
    @IsOptional()
    yellow_feed?: string

    @Transform(({ value }) => value.toString())
    @IsString()
    @ApiProperty()
    @IsOptional()
    y_time: string
}