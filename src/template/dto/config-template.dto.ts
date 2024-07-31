import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TemplateFrequency, TemplateStatus } from "../interfaces";

export class BaseTemplateConfig {
    @IsOptional()
    @IsEnum(TemplateStatus)
    status?: TemplateStatus;

    @IsString()
    @IsNotEmpty()
    @IsEnum(TemplateFrequency)
    frequency: TemplateFrequency;

    @IsOptional()
    @IsString()
    scheduleTime?: string;

    @IsOptional()
    @IsString()
    nextScheduleAt?: string;

    @IsOptional()
    @IsString()
    lastScheduleAt?: string;

    @IsOptional()
    @IsString()
    scheduleDate?: string;

    @IsOptional()
    @IsNumber()
    noOfDaysInterval?: Number;

    @IsOptional()
    @IsArray()
    scheduleDay?: Number[];

    @IsNotEmpty()
    @IsString()
    channelId: string;

    @IsOptional()
    @IsBoolean()
    anonymous?: boolean;
}