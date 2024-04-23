import {
  Controller,
  Get,
  Res,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { Cat } from 'src/interfaces/ICat.interface';
import { ResponseType } from '../../constant/type';
import { ResponseData } from 'src/services/response.service';
import { ServerMessage, ServerStatus } from 'src/constant/enum';
import { CatsService } from './cats.service';
import { CreateCatDto, UpdateCatDto } from 'src/dto/cats.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(
    @Body() createCatDto: CreateCatDto,
    @Res() res: Response,
  ): ResponseType<Cat> {
    try {
      return res.json(
        new ResponseData(
          this.catsService.create(createCatDto),
          ServerStatus.OK,
          ServerMessage.OK,
        ),
      );
    } catch (error) {
      return res.json(
        new ResponseData(null, ServerStatus.ERROR, ServerMessage.ERROR),
      );
    }
  }

  @Get()
  findAll(@Res() res: Response): ResponseType<Cat> {
    try {
      return res.json(
        new ResponseData(
          this.catsService.findAll(),
          ServerStatus.OK,
          ServerMessage.OK,
        ),
      );
    } catch (error) {
      return res.json(
        new ResponseData(null, ServerStatus.ERROR, ServerMessage.ERROR),
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Res() res: Response) {
    try {
      return res.json(
        new ResponseData(
          this.catsService.findOne(id),
          ServerStatus.OK,
          ServerMessage.OK,
        ),
      );
    } catch (error) {
      return res.json(
        new ResponseData(null, ServerStatus.ERROR, ServerMessage.ERROR),
      );
    }
  }

  @Put()
  update(@Body() updateCatDto: UpdateCatDto, @Res() res: Response) {
    try {
      return res.json(
        new ResponseData(
          this.catsService.update(updateCatDto),
          ServerStatus.OK,
          ServerMessage.OK,
        ),
      );
    } catch (error) {
      return res.json(
        new ResponseData(null, ServerStatus.ERROR, ServerMessage.ERROR),
      );
    }
  }

  @Delete(':id')
  delete(@Param('id') id: number, @Res() res: Response) {
    try {
      return res.json(
        new ResponseData(
          this.catsService.delete(id),
          ServerStatus.OK,
          ServerMessage.OK,
        ),
      );
    } catch (error) {
      return res.json(
        new ResponseData(null, ServerStatus.ERROR, ServerMessage.ERROR),
      );
    }
  }
}
// @Get()
// findAll(@Query() query: ListAllEntities) {
//   return `This action returns all cats (limit: ${query.limit} items)`;
// }
