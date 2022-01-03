import { Cam, ControlsStatus, Statistics } from "@open-birdhouse/common";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "";
const REACT_APP_CAM_URL = process.env.REACT_APP_CAM_URL || "";

export default class ApiRequestService {
  async getCams(): Promise<Cam[]> {
    const response = await fetch(`${REACT_APP_API_URL}/api/cams`);
    const cams: Cam[] = await response.json();

    cams.forEach((cam) => {
      cam.url = `${REACT_APP_CAM_URL}${cam.url}`;
    });

    return cams;
  }

  async getStatistics(): Promise<Statistics> {
    const response = await fetch(`${REACT_APP_API_URL}/api/statistics`);
    return await response.json();
  }

  async getControls(): Promise<ControlsStatus> {
    const response = await fetch(`${REACT_APP_API_URL}/api/controls`);
    return await response.json();
  }

  async setControls(
    controls: ControlsStatus | undefined
  ): Promise<ControlsStatus> {
    const response = await fetch(`${REACT_APP_API_URL}/api/controls`, {
      method: "POST",
      body: JSON.stringify(controls),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }
}
