import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto, GetCatsDto } from 'src/dto/cats.dto';
import { Cat } from 'src/interfaces/cat.interface';
import { ResponseType } from '../../constant/type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles.enum';

@Controller('cats')
@UseGuards(JwtAuthGuard)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() GetCatsDto: GetCatsDto): Promise<ResponseType<Cat[]>> {
    return this.catsService.findAll(GetCatsDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cat> {
    return this.catsService.findOne(id);
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    await this.catsService.create(createCatDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCatDto: CreateCatDto,
  ): Promise<Cat> {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.catsService.delete(id);
  }
}
