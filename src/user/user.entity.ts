import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  // 조회 시 기본적으로 password는 SELECT 하지 않음 (로그인 시에만 명시적으로 조회)
  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
