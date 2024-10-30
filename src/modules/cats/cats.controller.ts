import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateCatDto, ParamsCats, UpdateCatDto } from 'src/dto/cats.dto';
// import { Cat } from 'src/interfaces/cat.interface';
import { ResponseCommon, ResponseDataListCommon } from 'src/interfaces/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ROLE } from '../auth/roles/roles.enum';
import { CatsService } from './cats.service';
import { Cat, CatDocument } from 'src/schemas/cats.schema';

@Controller('cats')
@UseGuards(JwtAuthGuard)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @Roles(ROLE.Admin, ROLE.User)
  @Get()
  async findAll(
    @Query() GetCatsDto: ParamsCats,
    @Headers('authorization') authHeader: string,
  ): Promise<ResponseCommon<ResponseDataListCommon<Cat[]>>> {
    const token = authHeader?.split(' ')[1];
    const user = await this.authService.decodeToken(token);
    return this.catsService.findAll(GetCatsDto, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseCommon<Cat>> {
    return this.catsService.findOne(id);
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto, @Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    const user = await this.authService.decodeToken(token);
    return await this.catsService.create(createCatDto, user.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto): Promise<ResponseCommon<Cat>> {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseCommon<Cat>> {
    return this.catsService.delete(id);
  }
}
