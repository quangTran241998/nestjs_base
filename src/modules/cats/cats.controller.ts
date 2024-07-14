import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from 'src/dto/cats.dto';
import { Cat } from 'src/interfaces/cat.interface';
// import { ResponseType } from '../../constant/type';
// import { ResponseData } from 'src/services/response.service';
// import { ServerMessage, ServerStatus } from 'src/constant/enum';
// import { Response } from 'express';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
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
