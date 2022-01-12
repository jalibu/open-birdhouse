import { Video } from "./api/Video";
import { Statistics } from "./api/Statistics";

export type Database = {
  statistics?: Statistics;
  videos?: Video[];
};
