import { Injectable } from '@nestjs/common';
import { CreateShoutOutDto } from './dto/create-shout-out.dto';
import { UpdateShoutOutDto } from './dto/update-shout-out.dto';

@Injectable()
export class ShoutOutService {
  create(createShoutOutDto: CreateShoutOutDto) {
    return 'This action adds a new shoutOut';
  }

  findAll() {
    return `This action returns all shoutOut`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoutOut`;
  }

  update(id: number, updateShoutOutDto: UpdateShoutOutDto) {
    return `This action updates a #${id} shoutOut`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoutOut`;
  }
}
