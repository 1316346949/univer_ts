import type { ICommand, IAccessor } from "@univerjs/core";
import { CommandType } from "@univerjs/core";
import { SheetsSelectionsService } from "@univerjs/sheets";
import { CustomerService } from "../../service/service";
import store from "../../../stores";

export const SingleButtonOperation: ICommand = {
  id: "custom-menu.operation.single-button",
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor) => {
    const sheetSelectionManagerService = accessor.get(SheetsSelectionsService);
    const ranges = sheetSelectionManagerService
      .getCurrentSelections()
      .map((selection) => selection.range);
    // 利用vuex将数据传进组件中
    store.commit("setRange", ranges);
    const customerService = accessor.get(CustomerService);
    customerService.alert('hello');
    return false;
  },
};
