import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PaginationResponse, ResponseCommon } from 'src/interfaces/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { ResponseHelper } from 'src/modules/response-common/responseCommon.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ROLE } from '../auth/roles/roles.enum';
import { ProfileDocument } from 'src/schemas/profile.schema';
import { CreateProfileDto, QueryProfiles, UpdateProfileDto } from 'src/dtos/profile.dto';
import { ProfileService } from './profile.service';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
@Roles(ROLE.Admin, ROLE.User)
export class ProfileController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHelper: ResponseHelper,
    private readonly profileService: ProfileService,
  ) {}

  @Get()
  async findAll(
    @Query() GetProfilesDto: QueryProfiles,
  ): Promise<ResponseCommon<{ profiles: ProfileDocument[] } & PaginationResponse>> {
    try {
      const profiles = await this.profileService.findAll(GetProfilesDto);
      return this.responseHelper.success(profiles);
    } catch (error) {
      return error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseCommon<ProfileDocument>> {
    try {
      const profile = await this.profileService.findOne(id);
      if (profile) {
        return this.responseHelper.success(profile);
      } else {
        throw this.responseHelper.error(`Không tìm thấy id ${id}`);
      }
    } catch (error) {
      return error;
    }
  }

  // @Post()
  // async create(
  //   @Body() CreateProfileDto: CreateProfileDto,
  //   @Headers('authorization') authHeader: string,
  // ): Promise<ResponseCommon<ProfileDocument>> {
  //   const token = authHeader?.split(' ')[1];
  //   const user = await this.authService.decodeToken(token);
  //   const profile = await this.profileService.create(CreateProfileDto, user.id);
  //   return this.responseHelper.success(profile);
  // }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateProfileDto: UpdateProfileDto,
  ): Promise<ResponseCommon<ProfileDocument>> {
    try {
      const profile = await this.profileService.update(id, UpdateProfileDto);
      if (profile) {
        return this.responseHelper.success(profile);
      } else {
        throw this.responseHelper.error(`Không tìm thấy id ${id}`);
      }
    } catch (error) {
      return error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseCommon<ProfileDocument>> {
    try {
      const profile = await this.profileService.delete(id);
      if (profile) {
        return this.responseHelper.success(profile);
      } else {
        throw this.responseHelper.error(`Không tìm thấy id ${id}`);
      }
    } catch (error) {
      return error;
    }
  }
}
