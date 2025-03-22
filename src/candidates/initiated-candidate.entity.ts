import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UploadedFile } from '../uploads/uploaded-file.entity';

@Entity()
export class InitiatedCandidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date_of_birth: string;

  @Column()
  gender: string;

  @Column()
  phone_number: string;

  @Column()
  present_address: string;

  @Column()
  connected_temple: string;

  @ManyToOne(() => UploadedFile, file => file.id)
  uploadedFile: UploadedFile;
}
