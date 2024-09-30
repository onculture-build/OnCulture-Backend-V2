import { IsOptional, IsString } from "class-validator";

export class FinishIntegrationDto {
    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    state?: string;
}
