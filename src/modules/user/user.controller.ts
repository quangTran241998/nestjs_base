import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ParamsUserDto } from 'src/dto/user.dto';
import { ResponseCommon, ResponseDataListCommon } from 'src/interfaces/common';
import { User } from 'src/schemas/user.schema';
import { Roles } from '../auth/roles/roles.decorator';
import { ROLE } from '../auth/roles/roles.enum';
import { UsersService } from './user.service';

@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles(ROLE.Admin)
  @Get()
  async findAll(@Query() ParamsUserDto: ParamsUserDto): Promise<ResponseCommon<ResponseDataListCommon<User[]>>> {
    return this.userService.findAll(ParamsUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseCommon<User>> {
    return this.userService.delete(id);
  }
}
