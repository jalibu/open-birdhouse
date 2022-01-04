import { StatusContextType } from "@open-birdhouse/common";

export default class GenericApiRequestService {
  private statusContext: StatusContextType;

  constructor(statusContext: StatusContextType) {
    this.statusContext = statusContext;
  }

  protected getHeaders = (): Headers => {
    const headers: Headers = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    return headers;
  };

  protected doFetch = async <T>(
    url: RequestInfo,
    options: RequestInit,
    isJson = false,
    showLoader = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<T | null> => {
    let response;
    try {
      if (showLoader) this.statusContext.addLoader();
      response = await fetch(url, options);
      if (response.ok) {
        return isJson ? await response.json() : await response.text();
      }
      throw Error(`Error fetching data: ${response.statusText}`);
    } catch (err: any) {
      if (response) {
        this.statusContext.addMessage({
          title: `Error ${response.status}`,
          text: err.message,
          kind: "error",
        });
      } else {
        this.statusContext.addMessage({
          title: `Error`,
          text: err.message,
          kind: "error",
        });
      }

      // eslint-disable-next-line no-console
      console.warn(err.message);
    } finally {
      if (showLoader) this.statusContext.finalizeLoader();
    }

    return null;
  };
}
