import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryProfiles } from 'src/dtos/profile.dto';
import { PaginationResponse } from 'src/interfaces/common';
import { Profile, ProfileDocument } from 'src/schemas/profile.schema';
import { CreateProfileDto, UpdateProfileDto } from 'src/dtos/profile.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    @Inject(forwardRef(() => AuthService))
    private profileModel: Model<ProfileDocument>,
  ) {}

  async findAll(filters: QueryProfiles): Promise<{ profiles: ProfileDocument[] } & PaginationResponse> {
    const { page: pageQuery, size: sizeQuery, ...searchCriteria } = filters;
    const query = this.buildSearchQuery(searchCriteria);

    const page = pageQuery ?? 1;
    const size = sizeQuery ?? 10;

    const offset = (page - 1) * size;

    const [data, count] = await Promise.all([
      this.profileModel.find(query).skip(offset).limit(size).exec(),
      this.profileModel.countDocuments(query).exec(),
    ]);

    return { profiles: data, total: count, page, size };
  }

  async findOne(id: string): Promise<ProfileDocument> {
    const profile = await this.profileModel.findOne({ _id: id }).exec();
    return profile;
  }

  async create(CreateProfileDto: CreateProfileDto, userId: string) {
    const profile = new this.profileModel({ ...CreateProfileDto, userId: userId });
    await profile.save();
  }

  async update(id: string, UpdateProfileDto: UpdateProfileDto): Promise<ProfileDocument> {
    const profile = await this.profileModel.findOneAndUpdate({ _id: id }, UpdateProfileDto, { new: true }).exec();
    return profile;
  }

  async delete(id: string): Promise<ProfileDocument> {
    const profile = await this.profileModel.findOneAndDelete({ _id: id }).exec();
    return profile;
  }

  //search params
  private buildSearchQuery(searchCriteria: Partial<QueryProfiles>) {
    const query: any = {};
    if (searchCriteria.fullname) {
      query.fullname = { $regex: searchCriteria.fullname, $options: 'i' };
    }

    return query;
  }
}
