import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateCatDto, QueryCats, UpdateCatDto } from 'src/dtos/cat.dto';
import { PaginationResponse, ResponseCommon } from 'src/interfaces/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { ResponseHelper } from 'src/modules/response-common/responseCommon.service';
import { CatDocument } from 'src/schemas/cats.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ROLE } from '../auth/roles/roles.enum';
import { CatService } from './cat.service';

@Controller('cats')
@UseGuards(JwtAuthGuard)
@Roles(ROLE.Admin, ROLE.User)
export class CatController {
  constructor(
    private readonly CatService: CatService,
    private readonly authService: AuthService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Get()
  async findAll(@Query() GetCatsDto: QueryCats): Promise<ResponseCommon<{ cats: CatDocument[] } & PaginationResponse>> {
    try {
      const cats = await this.CatService.findAll(GetCatsDto);
      return this.responseHelper.success(cats);
    } catch (error) {
      return error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseCommon<CatDocument>> {
    try {
      const cat = await this.CatService.findOne(id);
      if (cat) {
        return this.responseHelper.success(cat);
      } else {
        throw this.responseHelper.error(`Không tìm thấy id ${id}`);
      }
    } catch (error) {
      return error;
    }
  }

  @Post()
  async create(
    @Body() createCatDto: CreateCatDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ResponseCommon<CatDocument>> {
    const token = authHeader?.split(' ')[1];
    const user = await this.authService.decodeToken(token);
    const cat = await this.CatService.create(createCatDto, user.id);
    return this.responseHelper.success(cat);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto): Promise<ResponseCommon<CatDocument>> {
    try {
      const cat = await this.CatService.update(id, updateCatDto);
      if (cat) {
        return this.responseHelper.success(cat);
      } else {
        throw this.responseHelper.error(`Không tìm thấy id ${id}`);
      }
    } catch (error) {
      return error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseCommon<CatDocument>> {
    try {
      const cat = await this.CatService.delete(id);
      if (cat) {
        return this.responseHelper.success(cat);
      } else {
        throw this.responseHelper.error(`Không tìm thấy id ${id}`);
      }
    } catch (error) {
      return error;
    }
  }
}
