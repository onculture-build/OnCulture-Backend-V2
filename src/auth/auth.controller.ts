import { Body, Controller, Get, Patch, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { AuthStrategyType, RequestWithUser } from './interfaces';
import { SignUpDto } from './dto/signup.dto';
import { RealIP } from 'nestjs-real-ip';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AllowedUserDto } from './dto/allowed-user.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@AuthStrategy(AuthStrategyType.PUBLIC)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponseMeta({ message: 'Email added to allowed users' })
  @ApiOperation({ summary: 'Add email to list of allowed users' })
  @ApiBearerAuth()
  @AuthStrategy(AuthStrategyType.JWT)
  @Post('allowed-users')
  async addAllowedUser(
    @Body() dto: AllowedUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.addAllowedUser(dto, req);
  }

  @ApiResponseMeta({ message: 'User is allowed' })
  @ApiOperation({ summary: 'Verify if email is allowed' })
  @Post('check-allowed-user')
  async checkAllowedUser(@Body() dto: AllowedUserDto) {
    return this.authService.checkAllowedUser(dto);
  }

  @ApiOperation({ summary: 'Get all allowed users' })
  @ApiBearerAuth()
  @AuthStrategy(AuthStrategyType.JWT)
  @Get('allowed-users')
  async getAllowedUsers() {
    return this.authService.getAllowedUsers();
  }

  @ApiOperation({ summary: 'Authenticate a user' })
  @Post('login')
  async signin(
    @Body() dto: LoginDto,
    @RealIP() parseIp: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.loginUser(dto, parseIp.toString(), response);
  }

  @ApiOperation({ summary: 'Sign up and set up a company profile' })
  @Post('signup')
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
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @ApiResponseMeta({ message: 'Password reset successfully' })
  @ApiOperation({ summary: 'Reset user password' })
  @Patch('password-reset')
  async passwordReset(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
