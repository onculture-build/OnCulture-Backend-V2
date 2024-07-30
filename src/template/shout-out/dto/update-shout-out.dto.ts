import { PartialType } from '@nestjs/mapped-types';
import { CreateShoutOutDto } from './create-shout-out.dto';

export class UpdateShoutOutDto extends PartialType(CreateShoutOutDto) {}
