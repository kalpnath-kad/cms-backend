import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class UploadedFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @ManyToOne(() => User, user => user.uploads)
  uploader: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved';

  @CreateDateColumn()
  createdAt: Date;
}
