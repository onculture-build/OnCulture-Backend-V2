import { CrudService } from '@@/common/database/crud.service';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { BaseStateMapType } from './base-state.maptype';
import { GetStatesDto } from './dto/get-states.dto';

@Injectable()
export class BaseStateService extends CrudService<
  Prisma.BaseStateDelegate,
  BaseStateMapType
> {
  constructor(private prisma: PrismaClient) {
    super(prisma.baseState);
  }

  async getStates(countryId: string, { term, ...pagination }: GetStatesDto) {
    const dto: Prisma.BaseStateFindManyArgs = {
      where: { countryId },
    };

    dto.where = term
      ? {
          AND: [{ ...dto.where }],
          OR: [
            {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
            {
              iso2: {
                contains: term,
                mode: 'insensitive',
              },
            },
          ],
        }
      : dto.where;

    return this.findManyPaginate(dto, pagination);
  }

  async getState(countryId: string, stateId: string) {
    const dto: Prisma.BaseStateFindFirstArgs = {
      where: { countryId: countryId, id: stateId },
    };

    return this.findFirstOrThrow(dto);
  }
}
