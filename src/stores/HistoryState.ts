import { defineStore } from "pinia";

interface HistoryState {
  range: Range[];
}
interface Range {
  endColumn?: number;
  endRow?: number;
  rangeType?: number;
  sheetId?: string;
  startColumn?: number;
  startRow?: number;
  unitId?: string;
}
export const useHistoryStore = defineStore("history", {
  state: (): HistoryState => ({
    range: [],
  }),

  actions: {
    viewRange(newRanges: Range[]) {
      this.range = newRanges;
    },
  },

  getters: {
    recordRange(state): Range[] {
      return state.range;
    },
  },
});
