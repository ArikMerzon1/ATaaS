import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import _get from "lodash.get";
import { singleton } from "tsyringe";
import Helpers from "./helpers";

@singleton()
export class HttpProvider {
  private readonly baseUtl: string;

  constructor() {
    this.baseUtl = Helpers.getValue(process.env.BASE_REST_API) as string;
  }

  private async getOauth2Token(failOauth: boolean): Promise<string> {
    if (failOauth) return "";
    const axiosRequest: AxiosRequestConfig = {
      method: "post",
      url: `${this.baseUtl}/oauth2/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: Helpers.getValue(process.env.AUTH) as string,
      },
    };

    return axios(axiosRequest)
      .then((response: AxiosResponse) => {
        console.log(`accessToken: ${JSON.stringify(response.data)}`);
        return response.data.access_token;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async get(path: string, expectedFailure = false, oauthFailure = false): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: "get",
      url: `${this.baseUtl}/${path}`,
      headers: {
        Authorization: await this.getOauth2Token(oauthFailure),
        "Content-Type": "application/json",
      },
    };

    console.log(config);

    let response: AxiosResponse;

    try {
      response = await axios(config);
      console.log(`data: ${JSON.stringify(response.data)}`);
      return response;
    } catch (error) {
      if (expectedFailure) {
        throw error;
      }
      if (!path.includes("get_events"))
        throw new Error(
          `${(error as AxiosError)?.message}\nError Status Test: ${(error as AxiosError)?.response?.statusText}\nURL: ${(error as AxiosError)?.config?.url}`
        );
      throw error;
    }
  }

  async post(path: string, body: string, expectedFailure = false, oauthFailure = false): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: "post",
      url: `${this.baseUtl}/${path}`,
      headers: {
        Authorization: await this.getOauth2Token(oauthFailure),
        "Content-Type": "application/json",
      },
      data: body,
    };

    console.log(config);
    try {
      const response = await axios(config);
      console.log(`response data: ${JSON.stringify(response.data)}`);
      const key = Object.keys(response.data)[0];
      if (response.data[key].success) {
        return response;
      }
      if (expectedFailure) return response;
      const { messages } = response.data[key].messages;
      return messages.data.message;
    } catch (error) {
      const message = _get((error as AxiosError)?.response?.data, "message");

      console.error((error as AxiosError)?.response?.statusText);
      throw Error(message);
    }
  }

  async newGet(path: string): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: "get",
      url: `${path}`,
      headers: {
        // Authorization: `${await this.getOauth2Token()}`,
        "Content-Type": "application/json",
      },
    };

    console.log(config);

    try {
      const response = await axios(config);
      console.log(`data: ${JSON.stringify(response.data)}`);
      return response;
    } catch (error) {
      if (!path.includes("get_events"))
        throw new Error(
          `${(error as Error).message}\nError Status Test: ${(error as AxiosError)?.response?.statusText}\nURL: ${(error as AxiosError)?.config?.url}`
        );
      throw error;
    }
  }
}

export default { HttpProvider };
