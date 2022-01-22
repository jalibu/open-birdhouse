import { StatusContextType } from "../Models/StatusContextType";

export type LoaderOptions = {
  isJson?: boolean;
  showLoader?: boolean;
  raiseError?: boolean;
};

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
    loaderOptions?: LoaderOptions
  ): Promise<T | null> => {
    loaderOptions = Object.assign(
      { isJson: true, showLoader: true, raiseError: true },
      loaderOptions
    );

    let response;
    try {
      if (loaderOptions?.showLoader) this.statusContext.addLoader();
      response = await fetch(url, options);
      if (response.ok) {
        return loaderOptions?.isJson
          ? await response.json()
          : await response.text();
      }
      throw Error(`Error fetching data: ${response.statusText}`);
    } catch (err: any) {
      if (loaderOptions?.raiseError) {
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
      }

      console.warn(err.message);
    } finally {
      if (loaderOptions?.showLoader) this.statusContext.finalizeLoader();
    }

    return null;
  };
}
