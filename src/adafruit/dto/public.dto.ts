import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PublicDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    group?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    state: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    state_feed: string

    @Transform(({ value }) => value.toString())
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    time: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    time_feed: string

    @Transform(({ value }) => value.toString())
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    density: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    dens_feed: string

    constructor(partial?: Partial<PublicDto>) {
        Object.assign(this, partial);
    }
}

export class NewFeedDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    group?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string

    constructor(partial?: Partial<NewFeedDto>) {
        Object.assign(this, partial);
    }
}