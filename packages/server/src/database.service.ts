import { Injectable, Logger } from '@nestjs/common';
import { Database, Statistics, Video } from '@open-birdhouse/common';
import * as fs from 'fs';

@Injectable()
export class DatabaseService {
  private db: Database = {};

  constructor(private readonly logger: Logger) {
    try {
      this.db = JSON.parse(fs.readFileSync(process.env.DATABASE_FILE, 'utf-8'));
      logger.log(
        'Successfully parsed existing file database',
        DatabaseService.name,
      );
    } catch (err) {
      logger.warn(
        'Could not read database file. Creating a new one',
        DatabaseService.name,
      );
      fs.writeFileSync(process.env.DATABASE_FILE, JSON.stringify(this.db));
    }
  }

  public getGallery = (): Video[] => {
    // Parse database date to real date
    this.db.videos =
      this.db.videos?.map((video) => {
        video.date = new Date(video.date);
        return video;
      }) || [];
    return this.db.videos;
  };

  public setGallery = (newGallery: Video[]): Video[] => {
    const clonedDatabase = { ...this.db };
    clonedDatabase.videos = newGallery;
    this.persistData(clonedDatabase);

    return this.db.videos;
  };

  public getStatistics = (): Statistics | null => {
    return this.db.statistics;
  };

  public setStatistics = (newStatistics: Statistics): Statistics => {
    const clonedDatabase = { ...this.db };
    clonedDatabase.statistics = newStatistics;
    this.persistData(clonedDatabase);

    return this.db.statistics;
  };

  private persistData = (newData: Database) => {
    try {
      fs.writeFileSync(process.env.DATABASE_FILE, JSON.stringify(newData));
      this.db = newData;
    } catch (err) {
      this.logger.warn(
        `Could not update database: ${err.message}`,
        DatabaseService.name,
      );
    }
  };
}
