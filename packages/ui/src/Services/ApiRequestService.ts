import { Cam, ControlsStatus, Statistics } from "@open-birdhouse/common";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "";
const REACT_APP_CAM_URL = process.env.REACT_APP_CAM_URL || "";

export default class ApiRequestService {
  async getCams(): Promise<Cam[]> {
    const response = await fetch(`${REACT_APP_API_URL}/api/cams`, {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const cams: Cam[] = await response.json();

    cams.forEach((cam) => {
      cam.url = `${REACT_APP_CAM_URL}${cam.url}`;
    });

    return cams;
  }

  async getStatistics(): Promise<Statistics> {
    const response = await fetch(`${REACT_APP_API_URL}/api/statistics`, {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    return await response.json();
  }

  async getControls(): Promise<ControlsStatus> {
    const response = await fetch(`${REACT_APP_API_URL}/api/controls`, {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    return await response.json();
  }

  async setControls(
    controls: ControlsStatus | undefined
  ): Promise<ControlsStatus> {
    const response = await fetch(`${REACT_APP_API_URL}/api/controls`, {
      method: "POST",
      body: JSON.stringify(controls),
      headers: {
        "Bypass-Tunnel-Reminder": "true",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }
}
