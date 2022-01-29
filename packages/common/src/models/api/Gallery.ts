export type Gallery = {
  uri: string;
  contents: Content[];
};

export type GalleryUpdateResult = {
  databaseDeletes?: Content[];
};

export type Content = {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  date?: Date;
  filesize?: number;
  lengthInSeconds?: number;
  annotations?: annotation[];
};

type annotation = {
  name: string;
  score: number;
};
