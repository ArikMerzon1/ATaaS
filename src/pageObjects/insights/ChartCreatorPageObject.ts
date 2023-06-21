import _get from "lodash.get";
import { By, ThenableWebDriver, WebElement, until } from "selenium-webdriver";
import { inject, injectable } from "tsyringe";
import helpers from "../../utils/helpers";
import { DashboardCubeFilter, PivotConfig, TOrderMember } from "../../utils/models/dashboard";
import { ISubMenu } from "../sidebarPageObjects/ISubMenu";

type FilterClassName = { trigger: string; items: string };

@injectable()
export class ChartCreatorPageObject implements ISubMenu {
  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver) {}

  async CreateTemplate(): Promise<this> {
    const createTemplateButton = await helpers.getElement(By.css(`[data-test-id="chart-creator-create-template"]`));
    await createTemplateButton.click();

    return this;
  }

  async SelectFilters(filter: DashboardCubeFilter): Promise<this> {
    await this.SelectChartFilters(filter);
    return this;
  }

  async GenerateChart(): Promise<void> {
    await (await helpers.getElement(By.css("[data-test-id='generate-chart-button']"))).click();

    await this.webDriver.wait(until.elementLocated(By.className("dashboard-wizard__graph")));
    await helpers.takeScreenshot("dashboard-pivot-set");
  }

  protected async SelectChartFilters(filter: DashboardCubeFilter): Promise<void> {
    const dropdownFilterSelectorIdMap: Partial<Record<keyof DashboardCubeFilter, FilterClassName>> = {
      type: {
        trigger: '[data-test-id="chart-creator-chart-type"]',
        items: ".popover-chart.chart-type .r-dropdown-item",
      },

      area: {
        trigger: '[data-test-id="chart-creator-area"]',
        items: ".popover-chart.area .r-dropdown-item",
      },

      measures: {
        trigger: '[data-test-id="chart-creator-measures"]',
        items: '[data-test-id="chart-creator-measures"] .b-checkbox',
      },

      dimensions: {
        trigger: '[data-test-id="chart-creator-dimensions"]',
        items: '[data-test-id="chart-creator-dimensions"] .b-checkbox',
      },
    };

    for (const filterKey in filter) {
      if (filterKey in dropdownFilterSelectorIdMap) {
        const dataTestId = _get(dropdownFilterSelectorIdMap, filterKey) as FilterClassName | undefined;
        const filterValue = _get(filter, filterKey) as string | string[];
        const dropdownSelectableValues = !Array.isArray(filterValue) ? [filterValue] : filterValue;

        if (dataTestId) {
          const dropdownTrigger = await helpers.getElement(By.css(dataTestId.trigger));
          await dropdownTrigger.click();
          await helpers.scrollToElement(dropdownTrigger);

          const dropdownItems = await helpers.getElements(By.css(dataTestId.items));

          const dropdownTexts = await Promise.all(dropdownItems.map((item) => item.getText()));

          await Promise.all(
            dropdownSelectableValues.map(async (dropdownValue) => {
              console.log(dropdownItems.length, "chart filter value", dropdownValue);

              // find the selected option on viewport
              const dropdownIndex = dropdownTexts.findIndex((text) => text?.toLowerCase()?.includes(String(dropdownValue).toLowerCase()));

              const selectedOption = dropdownItems[dropdownIndex];

              console.log(`Filter ${filterKey} [data-test-id="${dataTestId.items}"]`);
              await selectedOption?.click();
            })
          );

          // // for multi select dropdown, click "Filter" to apply changes
          if (dataTestId.items.includes(".b-checkbox")) {
            console.log("can now click apply", `${dataTestId.trigger} .dropdown-multiselect__actions__apply`);

            const applyButton = await helpers.getElement(By.css(`${dataTestId.trigger} .dropdown-multiselect__actions__apply`));
            await applyButton.click();
          }
        }
      }
    }

    if (filter.pivotConfig) {
      await this.SelectPivot(filter.pivotConfig);
    }

    if (filter.orderMembers) {
      await this.SelectOrder(filter.orderMembers);
    }

    if (filter.limit) {
      await this.AddLimit(filter.limit);
    }
  }

  async SelectOrder(orderMembers: TOrderMember[]): Promise<void> {
    // click on order button to open order modal
    await (await helpers.getElement(By.css("[data-test-id='chart-creator-order-button']"))).click();

    // select order for filter order members
    await Promise.all(
      orderMembers.map(async (member) => {
        const selectedOrderClass = `[data-test-id='chart-creator-order-button-${member.id}-${member.order}']`;

        if (await helpers.checkIfElementExists(By.css(selectedOrderClass))) {
          const memberElement = await helpers.getElement(By.css(selectedOrderClass));
          await memberElement.click();
        }
      })
    );

    await (await helpers.getElement(By.css(".modal-close"))).click();
  }

  async AddLimit(limit: number): Promise<void> {
    const limitInput = await helpers.getElement(By.css("[data-test-id='limit-input']"));
    await helpers.sendKeys(limitInput, String(limit));
  }

  async SelectPivot(pivotConfig: PivotConfig): Promise<void> {
    const { x: filterPivotX, y: filterPivotY } = pivotConfig;

    // click on pivot button to open pivot modal
    await (await helpers.getElement(By.css("[data-test-id='chart-creator-pivot-button']"))).click();

    // get pivotXParent for the drop
    const pivotXParent = await helpers.getElement(By.css("[data-test-id='chart-creator-pivot-x']"));
    // get pivotX items
    const pivotXItems = await helpers.getElements(By.css("[data-test-id='chart-creator-pivot-x'] .item"));

    // get pivotYParent for the drop
    const pivotYParent = await helpers.getElement(By.css("[data-test-id='chart-creator-pivot-y']"));
    // get pivotY items
    const pivotYItems = await helpers.getElements(By.css("[data-test-id='chart-creator-pivot-y'] .item"));

    if (filterPivotX?.length) {
      await this.DragAndDropPivot(pivotXItems, filterPivotX, pivotYParent);
    }

    if (filterPivotY?.length) {
      await this.DragAndDropPivot(pivotYItems, filterPivotY, pivotXParent);
    }

    await (await helpers.getElement(By.css(".modal-close"))).click();
  }

  protected async DragAndDropPivot(items: WebElement[], axis: string[], dropParent: WebElement): Promise<void> {
    const dragItemTexts = await Promise.all(items.map((item) => item.getText()));

    for (const axisValue of axis) {
      const dragElementIndex = dragItemTexts.findIndex((text) => text?.toLowerCase()?.includes(String(axisValue).toLowerCase()));
      const dragElement = items[dragElementIndex];

      console.log(axisValue, dragElementIndex, "value to drop");
      await this.webDriver.actions().move({ origin: dragElement }).perform();
      await this.webDriver.actions().press().move({ origin: dropParent }).perform();
      await this.webDriver.actions().release().perform();
    }
  }
}

export default { ChartCreatorPageObject };
