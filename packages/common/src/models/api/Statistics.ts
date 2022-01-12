export type Statistics = {
  visitors: {
    today: Visitor[];
    todayCalls: number;
    yesterday: Visitor[];
    yesterdayCalls: number;
  };
  animals: {
    todayCalls: number;
  };
};

export type Visitor = {
  id: string;
  date: number;
};
