import { Cam, Statistics } from "@open-birdhouse/common";
export default class ApiRequestService {
  async getCams(): Promise<Cam[]> {
    const response = await fetch("/api/cams");
    return await response.json();
  }

  async getStatistics(): Promise<Statistics> {
    const response = await fetch("/api/statistics");
    return await response.json();
  }
}
