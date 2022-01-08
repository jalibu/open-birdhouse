export type Video = {
  id: string;
  imageUrl: string;
  videoUrl: string;
  date?: Date;
  filesize?: number,
  lengthInSeconds?: number;
  annotations?: annotation[];
};

export type VideoApiResponse = {
  uri: string;
  videos: Video[];
};

type annotation = {
  name: string;
  score: number;
};
