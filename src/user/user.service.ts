import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  getAllUser() {
    return this.usersRepository.find();
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto ?? {};
    if (!email || !name || !password) {
      throw new HttpException(
        'Email, name and password must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    const exists = await this.usersRepository.exists({ where: { email } });
    if (exists) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const saved = await this.usersRepository.save({
      email,
      name,
      password: hashedPassword,
    });

    // 응답에는 비밀번호(해시)를 포함하지 않음
    const { password: _password, ...result } = saved;
    return result;
  }

  async login(loginDto: LoginDto) {
    if (!loginDto?.email) {
      throw new HttpException(
        'Email must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!loginDto.password) {
      throw new HttpException(
        'Password must not be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    // password 컬럼은 select: false 이므로 addSelect로 반드시 함께 조회
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email })
      .getOne();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, email: user.email };
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: this.jwtService.sign(payload),
    };
  }
}
