import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService
{
  constructor( @InjectRepository(User) private usersRepository: Repository<User>)
  {}

  async create(createUserDto: { email: string; password: string }): Promise<User>
  {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined>
  {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined>
  {
    return this.usersRepository.findOne({ where: { id } });
  }
}