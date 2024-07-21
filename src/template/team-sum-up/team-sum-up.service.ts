import { Injectable } from '@nestjs/common';
import { CreateTeamSumUpDto } from './dto/create-team-sum-up.dto';
import { UpdateTeamSumUpDto } from './dto/update-team-sum-up.dto';
import { RequestWithUser } from '../../auth/interfaces';
import { ConfigService } from '@nestjs/config';
import { PrismaClientManager } from '../../common/database/prisma-client-manager';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TeamSumUpService {

  constructor(
    private configService: ConfigService,
    private prismaClientManager: PrismaClientManager,
    private prismaClient: PrismaClient,
  ) {
    
  }
  async create(createTeamSumUpDto: CreateTeamSumUpDto, req: RequestWithUser) {
    const companyClient = this.prismaClientManager.getCompanyPrismaClient(req.user.companyId)
    return await companyClient.teamSumUpConfig.create({
      data: {
        
      }
    })
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
