import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class NewCRDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Crossroad ID", type: String })
    cr_id: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Crossroads address", type: String })
    address: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: "Total time of a traffic lights", type: Number })
    phase_time: number
}