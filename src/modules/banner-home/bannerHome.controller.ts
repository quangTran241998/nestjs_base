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
import { BannerHomeService } from './bannerHome.service';
import { CreateBannerHomeDto } from 'src/dto/bannerHome.dto';
import { BannerHome } from 'src/interfaces/bannerHome.interface';
import { ResponseType } from '../../constant/type';
// import { ResponseData } from 'src/services/response.service';
// import { ServerMessage, ServerStatus } from 'src/constant/enum';
// import { Response } from 'express';

@Controller('banner-home')
export class CatsController {
  constructor(private readonly BannerHomeService: BannerHomeService) {}

  @Get()
  async findAll(): Promise<ResponseType<BannerHome[]>> {
    return this.BannerHomeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseType<BannerHome>> {
    return this.BannerHomeService.findOne(id);
  }

  @Post()
  async create(@Body() CreateBannerHomeDto: CreateBannerHomeDto) {
    await this.BannerHomeService.create(CreateBannerHomeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() CreateBannerHomeDto: CreateBannerHomeDto,
  ): Promise<BannerHome> {
    return this.BannerHomeService.update(id, CreateBannerHomeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.BannerHomeService.delete(id);
  }
}
