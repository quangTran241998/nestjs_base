import { ResponseHelper } from 'src/modules/response-common/responseCommon.service';
import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ParamsUserDto } from 'src/dtos/user.dto';
import { PaginationResponse, ResponseCommon } from 'src/interfaces/common';
import { User, UserDocument } from 'src/schemas/user.schema';
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

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseCommon<User>> {
    return this.userService.delete(id);
  }
}
