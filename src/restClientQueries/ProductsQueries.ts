import { inject, injectable } from "tsyringe";
import dummyJson from "dummy-json";
import { HttpProvider } from "../utils/httpProvider";
import Helpers from "../utils/helpers";

@injectable()
export default class ProductsQueries {
  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  async addAccountProduct(accountReference: string): Promise<string> {
    try {
      console.log("addAccountProduct");
      const bodyFormat = [
        {
          accountReference: `${accountReference}`,
          productReference: "ProductRef_{{guid}}",
          name: "Macbook Pro",
          type: "Product",
          code: "Product_101",
          meta: {
            color: "Silver",
          },
        },
      ];

      const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
      const result = await this.httpProvider.post(`${clientId}/add_account_products`, dummyJson.parse(JSON.stringify(bodyFormat)));

      const key = Object.keys(result.data)[0];
      if (result.data[key].success) {
        const obj = JSON.parse(JSON.stringify(result.data[key])) as Response;
        return obj.data[0].productReference;
      }
      throw new Error(result.data[key].messages[0]);
    } catch (e) {
      throw Error(e);
    }
  }

  async updateAccountProducts(
    accountReference: string,
    productReference: string,
    type?: string,
    name?: string,
    code?: string,
    meta?: string[]
  ): Promise<string> {
    const bodyFormat = [
      {
        accountReference: `${accountReference}`,
        productReference: `${productReference}`,
        type: `${type}`,
        name: `${name}`,
        code: `${code}`,
        meta: `${meta}`,
      },
    ];

    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/update_account_products`, dummyJson.parse(JSON.stringify(bodyFormat)));
    return JSON.stringify(result.data);
  }
}

export interface Response {
  success: boolean;
  data: Data[];
  messageIds: string[];
  messages: string[];
}

export interface Data {
  accountReference: string;
  productReference: string;
  name: string;
  meta: object;
}
