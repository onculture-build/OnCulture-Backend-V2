import { IsNotEmpty, IsString } from "class-validator";
import { TemplateStatus } from "../interfaces";

export class CreateTemplateDto {
    @IsString()
    @IsNotEmpty()
    templateFrequency: string;

    @IsString()
    @IsNotEmpty()
    scheduleTime: string;

    @IsString()
    @IsNotEmpty()
    status: TemplateStatus;

    @IsString()
    @IsNotEmpty()
    companyId: string;

    @IsString()
    @IsNotEmpty()
    templateType: string;

    @IsString()
    @IsNotEmpty()
    scheduleDay: string;

    @IsString()
    @IsNotEmpty()
    peerCallDuration: string;

    @IsString()
    @IsNotEmpty()
    nextScheduleAt: string;

    @IsString()
    @IsNotEmpty()
    scheduleDate: string;
}
