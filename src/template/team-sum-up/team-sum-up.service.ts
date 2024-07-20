import { Injectable } from '@nestjs/common';
import { CreateTeamSumUpDto } from './dto/create-team-sum-up.dto';
import { UpdateTeamSumUpDto } from './dto/update-team-sum-up.dto';

@Injectable()
export class TeamSumUpService {
  create(createTeamSumUpDto: CreateTeamSumUpDto) {
    return 'This action adds a new teamSumUp';
  }

  findAll() {
    return `This action returns all teamSumUp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teamSumUp`;
  }

  update(id: number, updateTeamSumUpDto: UpdateTeamSumUpDto) {
    return `This action updates a #${id} teamSumUp`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamSumUp`;
  }
}
