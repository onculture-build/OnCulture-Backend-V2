import { AuthStrategyType, JwtPayload } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { GetBranchesDto } from './dto/get-branches.dto';

@ApiTags('Company Branch')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('branch')
export class BranchController {
  constructor(private branchService: BranchService) {}

  @Get()
  async getAllBranches(@Query() query: GetBranchesDto) {
    return query;
  }

  @Get('id')
  async getBranch(@Param('id', ParseUUIDPipe) id: string) {
    return id;
  }

  @Post()
  async createBranch(@Body() dto: CreateBranchDto, @Req() req: JwtPayload) {
    return this.branchService.setupBranch(dto, req);
  }

  @Patch('id')
  async updateBranch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBranchDto,
    @Req() req: JwtPayload,
  ) {
    return this.branchService.updateBranch(id, dto, req);
  }
}
