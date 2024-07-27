import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from 'src/dto/user.dto';
import { User } from '../../../schemas/user.schema';
import { ResponseType } from 'src/constant/type';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getUser(@Headers('authorization') authorization: string) {
    const token = authorization?.split(' ')[1];
    return this.profileService.getProfileUser(token);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseType<User>> {
    return this.profileService.updateProfile(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.profileService.deleteProfile(id);
  }
}
