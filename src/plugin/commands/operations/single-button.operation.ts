import type { ICommand, IAccessor } from "@univerjs/core";
import { createPinia } from "pinia";
import { CommandType } from "@univerjs/core";
import { SheetsSelectionsService } from "@univerjs/sheets";
import store from "../../../stores";
// import { useHistoryStore } from "../../../stores/HistoryState";
// const pinia = createPinia();
// const historyStore = useHistoryStore(pinia);
export const SingleButtonOperation: ICommand = {
  id: "custom-menu.operation.single-button",
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor) => {
    // const pinia = createPinia();
    // const historyStore = useHistoryStore(pinia);
    const sheetSelectionManagerService = accessor.get(SheetsSelectionsService);
    const ranges = sheetSelectionManagerService
      .getCurrentSelections()
      .map((selection) => selection.range);
    store.commit("setRange",ranges);
    return true;
  },
};
