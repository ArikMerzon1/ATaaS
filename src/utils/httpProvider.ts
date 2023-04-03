import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
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
        return error;
      }
      if (!path.includes("get_events")) throw new Error(`${error.message}\nError Status Test: ${error.response.statusText}\nURL: ${error.config.url}`);
      return error;
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
    } catch (err) {
      console.error(err.response.statusText);
      throw Error(err.response.data.message);
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
      if (!path.includes("get_events")) throw new Error(`${error.message}\nError Status Test: ${error.response.statusText}\nURL: ${error.config.url}`);
      return error;
    }
  }
}

export default { HttpProvider };
