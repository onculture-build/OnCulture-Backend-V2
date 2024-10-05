import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  allowedImageMimeTypes,
  PROFILE_UPLOAD_MAX_SIZE_BYTES,
} from '@@/common/constants';
import { DocumentUploadInterceptor } from '@@/common/interceptors/document.interceptor';
import { UploadUserPhotoDto } from './dto/upload-user-photo.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { UserRolesService } from './user-roles/user-roles.service';
import { PaginationSearchOptionsDto } from '@@/common/interfaces/pagination-search-options.dto';

@ApiTags('Users & Profile')
@AuthStrategy(AuthStrategyType.JWT)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private userRolesService: UserRolesService,
  ) {}

  @Get()
  async getUser(@Req() req: RequestWithUser) {
    return this.userService.getUser(req.user.userId);
  }

  @Get('roles')
  async getUserRoles(@Query() dto: PaginationSearchOptionsDto) {
    return this.userRolesService.getUserRoles(dto);
  }

  @ApiResponseMeta({ message: 'Profile picture updated successfully' })
  @ApiOperation({ summary: 'Upload user profile picture' })
  @ApiConsumes('multipart/form-data')
  @Put('profile-photo')
  @UseInterceptors(
    new DocumentUploadInterceptor().createInterceptor(
      'photo',
      allowedImageMimeTypes,
      null,
      PROFILE_UPLOAD_MAX_SIZE_BYTES,
    ),
  )
  async changeUserPhoto(
    @UploadedFile() photo: Express.Multer.File,
    @Body() dto: UploadUserPhotoDto,
    @Req() req: RequestWithUser,
  ) {
    if (!photo) throw new UnprocessableEntityException('Photo is required');
    dto.photo = photo;

    return await this.userService.updateUserProfilePicture(dto, req);
  }
}
