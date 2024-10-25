import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateArticleDto } from 'src/dto/article.dto';
import { Article } from 'src/interfaces/article.interface';
import { ResponseType } from '../../constant/type';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly ArticleService: ArticleService) {}

  @Get()
  async findAll(): Promise<ResponseType<Article[]>> {
    return this.ArticleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseType<Article>> {
    return this.ArticleService.findOne(id);
  }

  @Post()
  async create(@Body() CreateArticleDto: CreateArticleDto) {
    await this.ArticleService.create(CreateArticleDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() CreateArticleDto: CreateArticleDto): Promise<ResponseType<Article>> {
    return this.ArticleService.update(id, CreateArticleDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseType<Article>> {
    return this.ArticleService.delete(id);
  }
}
