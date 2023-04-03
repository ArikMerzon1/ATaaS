import { injectable } from "tsyringe";
import StrategyStepBasePo from "./StrategyStepBasePo";

@injectable()
export default class IfConditionActionPo extends StrategyStepBasePo {
  async SetProperties(properties: string[]): Promise<this> {
    await console.log("Set Properties");

    return this;
  }
}
