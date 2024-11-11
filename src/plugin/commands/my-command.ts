import type { ICommand, IAccessor } from "@univerjs/core";
import { CommandType } from "@univerjs/core";
import { SheetsSelectionsService } from "@univerjs/sheets";
export interface IYourCommandInterface {
  // Your command's param's interface.
}
//点击菜单选项触发的自定义事件
export const ClickOperation: ICommand = {
  id: "sheet.command.click",
  type: CommandType.COMMAND,
  handler: async (accessor: IAccessor, { target }: any): Promise<boolean> => {
    const sheetSelectionManagerService = accessor.get(SheetsSelectionsService);
    
    const ranges = sheetSelectionManagerService
      .getCurrentSelections()
      .map((selection) => selection.range);
    console.log("🚀 ~ handler: ~ accessor:", ranges);

    return true;
  },
};
