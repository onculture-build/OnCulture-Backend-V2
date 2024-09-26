import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TemplateFrequency, TemplateStatus } from ".prisma/company";

export class BaseTemplateConfig {
    @IsOptional()
    @IsEnum(TemplateStatus)
    status?: TemplateStatus;

    @IsString()
    @IsNotEmpty()
    @IsEnum(TemplateFrequency)
    frequency: TemplateFrequency;

    @IsNotEmpty()
    @IsString()
    scheduleTime: string;

    @IsNotEmpty()
    @IsString()
    nextScheduleAt: string;

    @IsNotEmpty()
    @IsString()
    lastScheduleAt: string;

    @IsNotEmpty()
    @IsString()
    scheduleDate: string;

    @IsOptional()
    @IsNumber()
    noOfDaysInterval: number;

    @IsOptional()
    @IsArray()
    scheduleDay?: number[];

    @IsNotEmpty()
    @IsString()
    channelId: string;

    @IsOptional()
    @IsBoolean()
    anonymous: boolean;
}