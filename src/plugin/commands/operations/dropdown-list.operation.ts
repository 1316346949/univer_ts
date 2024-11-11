import type { ICommand, IAccessor } from "@univerjs/core";
import { CommandType } from "@univerjs/core";
import { SheetsSelectionsService } from "@univerjs/sheets";
//点击菜单选项触发的自定义事件
export const DropdownListFirstItemOperation: ICommand = {
  //<li data-menu-id="rc-menu-uuid-06257-1-custom-menu.operation.dropdown-list-first-item"></li>
  id: "custom-menu.operation.dropdown-list-first-item",
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor) => {
    const sheetSelectionManagerService = accessor.get(SheetsSelectionsService);
    const ranges = sheetSelectionManagerService
      .getCurrentSelections()
      .map((selection) => selection.range);
    console.log("🚀 ~ handler: ~ accessor:", ranges);
    return true;
  },
};

export const DropdownListSecondItemOperation: ICommand = {
  id: "custom-menu.operation.dropdown-list-second-item",
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor) => {
    const sheetSelectionManagerService = accessor.get(SheetsSelectionsService);
    const ranges = sheetSelectionManagerService
      .getCurrentSelections()
      .map((selection) => selection.range);
    console.log("🚀 ~ handler: ~ accessor:", ranges);
    return true;
  },
};
