import { Cam, ControlsStatus, Statistics } from "@open-birdhouse/common";
export default class ApiRequestService {
  async getCams(): Promise<Cam[]> {
    const response = await fetch("/api/cams");
    return await response.json();
  }

  async getStatistics(): Promise<Statistics> {
    const response = await fetch("/api/statistics");
    return await response.json();
  }

  async getControls(): Promise<ControlsStatus> {
    const response = await fetch("/api/controls");
    return await response.json();
  }

  async setControls(
    controls: ControlsStatus | undefined
  ): Promise<ControlsStatus> {
    const response = await fetch("/api/controls", {
      method: "POST",
      body: JSON.stringify(controls),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }
}
