import { Injectable, Logger } from '@nestjs/common';
import { Database, Statistics, Content } from '@open-birdhouse/common';
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

  public getGallery = (): Content[] => {
    // Parse database date to real date
    this.db.contents =
      this.db.contents?.map((content) => {
        content.date = new Date(content.date);
        return content;
      }) || [];
    return this.db.contents;
  };

  public setGallery = (newGallery: Content[]): Content[] => {
    const clonedDatabase = { ...this.db };
    clonedDatabase.contents = newGallery;
    this.persistData(clonedDatabase);

    return this.db.contents;
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
