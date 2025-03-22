import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UploadedFile } from '../uploads/uploaded-file.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @OneToMany(() => UploadedFile, file => file.uploader)
  uploads: UploadedFile[];
}
