import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ParamsUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import { PaginationResponse, ResponseCommon } from 'src/interfaces/common';
import { ResponseHelper } from 'src/modules/response-common/responseCommon.service';
import { UserDocument } from 'src/schemas/user.schema';
import { Roles } from '../auth/roles/roles.decorator';
import { ROLE } from '../auth/roles/roles.enum';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UsersService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private userService: UsersService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Roles(ROLE.Admin)
  @Get()
  async findAll(
    @Query() ParamsUserDto: ParamsUserDto,
  ): Promise<ResponseCommon<{ users: UserDocument[] } & PaginationResponse>> {
    const users = await this.userService.findAll(ParamsUserDto);
    return this.responseHelper.success(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseCommon<UserDocument>> {
    try {
      const user = await this.userService.findOne(id);
      if (user) {
        return this.responseHelper.success(user);
      } else {
        throw this.responseHelper.error(`Không tìm thấy id ${id}`);
      }
    } catch (error) {
      return error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponseCommon<UserDocument>> {
    const user = await this.userService.update(id, updateUserDto);
    return this.responseHelper.success(user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseCommon<UserDocument>> {
    const user = await this.userService.delete(id);
    return this.responseHelper.success(user);
  }
}
