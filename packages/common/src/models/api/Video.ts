export type Video = {
  id: string;
  imageUrl: string;
  videoUrl: string;
  date?: Date;
  lengthInSeconds?: number;
  metadata?: any[]
};

export type VideoApiResponse = {
  uri: string;
  videos: Video[];
};

type metdadata = {
  name: string;
};
