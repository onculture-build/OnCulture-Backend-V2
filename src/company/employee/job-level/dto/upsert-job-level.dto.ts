import { PartialType } from '@nestjs/swagger';
import { CreateJobLevelDto } from './create-job-level.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpsertJobLevelDto extends PartialType(CreateJobLevelDto) { 
    @IsOptional()
    @IsUUID()
    id?: string;
}
