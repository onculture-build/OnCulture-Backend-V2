import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { AuthStrategyType, RequestWithUser } from './interfaces';
import { SignUpDto } from './dto/signup.dto';
import { RealIP } from 'nestjs-real-ip';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAllowedUserDto } from './dto/create-allowed-users.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FindAllowedUserDto } from './dto/find-allowed-user.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { OpenRoute } from '@@/common/decorators/route.decorator';

@ApiTags('Authentication')
@AuthStrategy(AuthStrategyType.PUBLIC)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponseMeta({ message: 'Email(s) added to allowed users' })
  @ApiOperation({ summary: 'Add emails to list of allowed users' })
  @ApiBearerAuth()
  @AuthStrategy(AuthStrategyType.JWT)
  @OpenRoute()
  @Post('allowed-users')
  async addAllowedUser(
    @Body() dto: CreateAllowedUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.addAllowedUsers(dto, req);
  }

  @ApiResponseMeta({ message: 'User is allowed' })
  @ApiOperation({ summary: 'Verify if email is allowed' })
  @Post('check-allowed-user')
  @OpenRoute()
  async checkAllowedUser(@Body() dto: FindAllowedUserDto) {
    return this.authService.checkAllowedUser(dto);
  }

  @ApiOperation({ summary: 'Get all allowed users' })
  @ApiBearerAuth()
  @AuthStrategy(AuthStrategyType.JWT)
  @Get('allowed-users')
  @OpenRoute()
  async getAllowedUsers() {
    return this.authService.getAllowedUsers();
  }

  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiResponseMeta({ message: 'You have logged in' })
  @Post('login')
  async signin(
    @Body() dto: LoginDto,
    @RealIP() parseIp: string,
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.loginUser(dto, parseIp.toString(), req, response);
  }

  @ApiOperation({ summary: 'Sign up and set up a company profile' })
  @ApiResponseMeta({
    message:
      'Registration successful. An email would be sent to complete sign up',
  })
  @Post('signup')
  @OpenRoute()
  async signup(@Body() dto: SignUpDto, @RealIP() parseIp: string) {
    return this.authService.onboardCompany(dto, parseIp.toString());
  }

  @ApiResponseMeta({ message: 'Password changed successfully' })
  @ApiOperation({ summary: "Change a user's password" })
  @ApiBearerAuth()
  @AuthStrategy(AuthStrategyType.JWT)
  @Patch('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.changePassword(changePasswordDto, req);
  }

  @ApiResponseMeta({ message: 'Password reset link sent successfully' })
  @ApiOperation({ summary: 'Request reset user password' })
  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.requestPasswordReset(dto, req);
  }

  @ApiResponseMeta({ message: 'Password reset successfully' })
  @ApiOperation({ summary: 'Reset user password' })
  @Patch('password-reset')
  async passwordReset(
    @Body() dto: ResetPasswordDto,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.resetPassword(dto, req);
  }

  @ApiResponseMeta({ message: 'Password set successfully' })
  @ApiOperation({ summary: 'Set a user password after signing up' })
  @Patch('set-password/:token')
  async setPassword(
    @Param('token') token: string,
    @Body() dto: SetPasswordDto,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.setPassword(token, dto, req);
  }
}
