import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { FileType } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
  ) {}
  findAll(userId: number, fileType: FileType) {
    const qb = this.repository.createQueryBuilder('file');

    qb.where('file.userId = :userId', { userId });

    if (fileType === FileType.PHOTOS) {
      qb.andWhere('file.mimetype = :mimetype', { mimetype: 'image/jpeg' });
    } else if (fileType === FileType.AUDIO) {
      qb.andWhere('file.mimetype = :mimetype', { mimetype: 'audio/mpeg' });
    } else if (fileType === FileType.VIDEOS) {
      qb.andWhere('file.mimetype = :mimetype', { mimetype: 'video/mp4' });
    } else if (fileType === FileType.DOCUMENTS) {
      qb.andWhere('file.mimetype = :mimetype', { mimetype: 'application/pdf' });
    } else if (fileType === FileType.TRASH) {
      qb.andWhere('file.deletedAt IS NOT NULL');
    }
    return qb.getMany();
  }

  create(file: Express.Multer.File, userId: number) {
    return this.repository.save({
      size: file.size,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      user: { id: userId },
    });
  }

  async delete(userId: number, ids: string) {
    const idsArray = ids.split(',');
    const qb = this.repository.createQueryBuilder('file');

    qb.where('id IN (:...ids) AND userId = :userId', { ids: idsArray, userId });

    return qb.softDelete().execute();
  }
}
