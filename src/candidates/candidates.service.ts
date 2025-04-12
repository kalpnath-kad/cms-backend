import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InitiatedCandidate } from './initiated-candidate.entity';
import { UploadedFile } from '../uploads/uploaded-file.entity';
import { GetUsersDto } from './dto/get.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';


@Injectable()
export class CandidatesService {
  constructor(@InjectRepository(InitiatedCandidate) private repo: Repository<InitiatedCandidate>) {}

  async bulkInsert(data: any[], file: UploadedFile) {
    const candidates = data.map(row => {
      return this.repo.create({
        name: row.name,
        date_of_birth: row.date_of_birth,
        gender: row.gender,
        phone_number: row.phone_number,
        present_address: row.present_address,
        connected_temple: row.connected_temple,
        uploadedFile: file,
      });
    });
    return this.repo.save(candidates);
  }

  async all() {
    return this.repo.find({ relations: ['uploadedFile'] });
  }

  async getCandidates(query: GetUsersDto) {
    // Extract pagination parameters with safety checks
    const pageNum = typeof query.page === 'number' ? query.page : Number(query.page) || 1;
    const limitNum = typeof query.limit === 'number' ? query.limit : Number(query.limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Initialize query builder
    const queryBuilder = this.repo.createQueryBuilder('candidate');
    
    // Apply filters
    if (query.connected_temple) {
      queryBuilder.andWhere('candidate.connected_temple = :temple', { 
        temple: query.connected_temple 
      });
    }
    
    if (query.name) {
      queryBuilder.andWhere('candidate.name ILIKE :name', { 
        name: `%${query.name}%` 
      });
    }
    
    if (query.gender) {
      queryBuilder.andWhere('LOWER(candidate.gender) = LOWER(:gender)', { 
        gender: query.gender 
      });
    }
    
    if (query.phone_number) {
      queryBuilder.andWhere('candidate.phone_number = :phone', { 
        phone: query.phone_number 
      });
    }
    
    if (query.present_address) {
      queryBuilder.andWhere('candidate.present_address ILIKE :address', { 
        address: `%${query.present_address}%` 
      });
    }

    // Add filter for uploadedFileId
    if (query.uploadedFileId) {
      queryBuilder.andWhere('uploadedFile.id = :fileId', {
        fileId: query.uploadedFileId
      });
    }
    
    // Handle generic search across multiple fields
    if (query.search) {
      queryBuilder.andWhere(
        '(candidate.name ILIKE :search OR ' +
        'candidate.connected_temple ILIKE :search OR ' +
        'candidate.present_address ILIKE :search OR ' +
        'candidate.phone_number ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }
    
    //Add relations
    //queryBuilder.leftJoinAndSelect('candidate.uploadedFile', 'uploadedFile');
    queryBuilder.leftJoin('candidate.uploadedFile', 'uploadedFile').addSelect('uploadedFile.id')
    
    // Execute query with pagination
    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limitNum)
      .getManyAndCount();
      
    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limitNum,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
      }
    };
  }

  async updateCandidate(id: number, updateDto: UpdateCandidateDto) {
    // Find the candidate first to ensure it exists
    const candidate = await this.repo.findOne({ where: { id } });
    
    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }
    
    // Update the candidate with the provided fields
    Object.assign(candidate, updateDto);
    
    // Save the updated candidate
    const updatedCandidate = await this.repo.save(candidate);
    
    return {
      message: 'Candidate updated successfully',
      data: updatedCandidate
    };
  }

  async getCandidate(id: number) {
    const candidate = await this.repo.findOne({ 
      where: { id },
      relations: ['uploadedFile'] // Include any needed relations
    });
    
    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }
    // If user role and not admin, verify access rights
    // if (currentUser && currentUser.role === 'user' && currentUser.id !== candidate.id) {
    //   throw new UnauthorizedException('You can only view your own profile');
    // }
    return candidate;
  }
}
