import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamSumUpDto } from './create-team-sum-up.dto';

export class UpdateTeamSumUpDto extends PartialType(CreateTeamSumUpDto) {}
