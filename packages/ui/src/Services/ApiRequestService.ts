import {
  Camera,
  GenericControl,
  Statistics,
  Gallery,
} from "@open-birdhouse/common";
import GenericApiRequestService from "./GenericApiRequestService";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "";
const REACT_APP_CAM_URL = process.env.REACT_APP_CAM_URL || "";

export default class ApiRequestService extends GenericApiRequestService {
  async getCams(): Promise<Camera[] | null> {
    const cams = await this.doFetch<Camera[]>(`${REACT_APP_API_URL}/api/cams`, {
      headers: this.getHeaders(),
    });

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
      }
    );
  }

  async getWeather(): Promise<any> {
    return await this.doFetch<Statistics>(
      `${REACT_APP_API_URL}/api/weather`,
      {
        headers: this.getHeaders(),
      },
      { showLoader: false, raiseError: false }
    );
  }

  async getControls(): Promise<GenericControl[] | null> {
    return await this.doFetch<GenericControl[]>(
      `${REACT_APP_API_URL}/api/controls`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  async getGalery(): Promise<Gallery | null> {
    return await this.doFetch<Gallery>(
      `${REACT_APP_API_URL}/api/gallery`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  async setControls(
    controls: GenericControl[] | undefined
  ): Promise<GenericControl[] | null> {
    return await this.doFetch<GenericControl[]>(
      `${REACT_APP_API_URL}/api/controls`,
      {
        method: "POST",
        body: JSON.stringify(controls),
        headers: this.getHeaders(),
      }
    );
  }
}
