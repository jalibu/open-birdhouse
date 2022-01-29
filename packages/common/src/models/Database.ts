import { Content } from "./api/Gallery";
import { Statistics } from "./api/Statistics";

export type Database = {
  statistics?: Statistics;
  contents?: Content[];
};
