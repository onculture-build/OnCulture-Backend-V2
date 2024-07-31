import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { TemplateFrequency, TemplateMood } from "../../interfaces"
import { BaseTemplateConfig } from "../../dto/config-template.dto";

export class CreateTeamSumUpDto { }

export class CreateTeamSumUpConfig extends BaseTemplateConfig {
    
    @IsEnum(TemplateMood)
    @IsNotEmpty()
    mood: TemplateMood;

    @IsArray()
    @IsNotEmpty()
    plan: String[];

    @IsArray()
    @IsNotEmpty()
    blockers: String[];

    @IsArray()
    @IsNotEmpty()
    support: String[];
}