import { Cam, ControlsStatus, Statistics } from "@open-birdhouse/common";
import GenericApiRequestService from "./GenericApiRequestService";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "";
const REACT_APP_CAM_URL = process.env.REACT_APP_CAM_URL || "";

export default class ApiRequestService extends GenericApiRequestService {
  async getCams(): Promise<Cam[]> {
    const cams: Cam[] = await this.doFetch(
      `${REACT_APP_API_URL}/api/cams`,
      {
        headers: this.getHeaders(),
      },
      true,
      true
    );

    cams.forEach((cam) => {
      cam.url = `${REACT_APP_CAM_URL}${cam.url}`;
    });

    return cams;
  }

  async getStatistics(): Promise<Statistics> {
    return await this.doFetch(
      `${REACT_APP_API_URL}/api/statistics`,
      {
        headers: this.getHeaders(),
      },
      true,
      true
    );
  }

  async getControls(): Promise<ControlsStatus> {
    return await this.doFetch(
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
  ): Promise<ControlsStatus> {
    return await this.doFetch(
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
