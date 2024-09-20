import { CrudService } from '@@/common/database/crud.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';
import { Injectable } from '@nestjs/common';
import { BaseCountry, Prisma, PrismaClient } from '@prisma/client';
import { BaseCountryMapType } from './base-country.maptype';
import { RequestWithUser } from '@@/auth/interfaces';
import lodash from 'lodash';

@Injectable()
export class BaseCountryService extends CrudService<
  Prisma.BaseCountryDelegate,
  BaseCountryMapType
> {
  constructor(private prisma: PrismaClient) {
    super(prisma.baseCountry);
  }

  async getCountries(dto: PaginationSearchOptionsDto) {
    const parsedQueryFilters = this.parseQueryFilter(dto, [
      'name',
      'iso2',
      'iso3',
      'continent',
      'timeZone',
    ]);
    const args: Prisma.BaseCountryFindManyArgs = {
      where: parsedQueryFilters,
    };
    dto.orderBy = 'name';
    return this.findManyPaginate(args, dto);
  }

  async getCountry(id: string, req?: RequestWithUser) {
    const dto: Prisma.BaseCountryFindFirstArgs = {
      where: { id },
      include: { states: true },
    };

    const result = await this.findFirstOrThrow(dto);

    const retComp: BaseCountry = <BaseCountry>result;
    if (req?.selectFields) {
      const resultFiltered = lodash.pick(
        { ...retComp },
        Object.keys(req.selectFields),
      );
      return resultFiltered;
    }
    return result;
  }
}
