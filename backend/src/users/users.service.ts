import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-passwordHash').exec();
  }

  async create(data: {
    email: string;
    name: string;
    passwordHash: string;
  }): Promise<UserDocument> {
    const createdUser = new this.userModel({
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      passwordHash: data.passwordHash,
    });
    return createdUser.save();
  }
}

