import { Body, Controller, Delete, Get, Headers, Param, Put, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from 'src/dto/user.dto';
import { ResponseCommon } from 'src/interfaces/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { User } from 'src/schemas/user.schema';

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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponseCommon<User>> {
    return this.profileService.updateProfile(id, updateUserDto);
  }
}
