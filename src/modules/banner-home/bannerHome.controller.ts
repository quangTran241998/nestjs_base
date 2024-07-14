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
import { CreateCatDto } from 'src/dto/cats.dto';
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
  async findOne(@Param('id') id: string): Promise<BannerHome> {
    return this.BannerHomeService.findOne(id);
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    await this.BannerHomeService.create(createCatDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCatDto: CreateCatDto,
  ): Promise<BannerHome> {
    return this.BannerHomeService.update(id, updateCatDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.BannerHomeService.delete(id);
  }
}
// @Get()
// async findAll(@Res() res: Response) {
//   try {
//     return res.json(
//       new ResponseData(
//         this.BannerHomeService.findAll(),
//         ServerStatus.OK,
//         ServerMessage.OK,
//       ),
//     );
//   } catch {}
// }
