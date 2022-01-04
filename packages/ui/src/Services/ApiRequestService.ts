import { Cam, ControlsStatus, Statistics } from "@open-birdhouse/common";
import GenericApiRequestService from "./GenericApiRequestService";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "";
const REACT_APP_CAM_URL = process.env.REACT_APP_CAM_URL || "";

export default class ApiRequestService extends GenericApiRequestService {
  async getCams(): Promise<Cam[] | null> {
    const cams = await this.doFetch<Cam[]>(
      `${REACT_APP_API_URL}/api/cams`,
      {
        headers: this.getHeaders(),
      },
      true,
      true
    );

    if (cams) {
      cams.forEach((cam) => {
        cam.url = `${REACT_APP_CAM_URL}${cam.url}`;
      });

      return cams;
    }

    return null;
  }

  async getStatistics(): Promise<Statistics | null> {
    return await this.doFetch<Statistics>(
      `${REACT_APP_API_URL}/api/statistics`,
      {
        headers: this.getHeaders(),
      },
      true,
      true
    );
  }

  async getControls(): Promise<ControlsStatus | null> {
    return await this.doFetch<ControlsStatus>(
      `${REACT_APP_API_URL}/api/controls`,
      {
        headers: this.getHeaders(),
      },
      true,
      true
    );
  }

  async setControls(
    controls: ControlsStatus | undefined
  ): Promise<ControlsStatus | null> {
    return await this.doFetch<ControlsStatus>(
      `${REACT_APP_API_URL}/api/controls`,
      {
        method: "POST",
        body: JSON.stringify(controls),
        headers: this.getHeaders(),
      },
      true,
      true
    );
  }
}
