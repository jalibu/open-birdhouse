export type Statistics = {
  visitors: {
    today: Visitor[];
    todayCalls: number;
    yesterday: Visitor[];
    yesterdayCalls: number;
  };
};

type Visitor = {
  id: string;
  date: number;
};
