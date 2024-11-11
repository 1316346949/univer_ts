/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { BooleanNumber, LocaleType, SheetTypes } from "@univerjs/core";

/**
 * Default workbook data
 * @type {IWorkbookData} document see https://univer.ai/typedoc/@univerjs/core/interfaces/IWorkbookData
 */
export const DEFAULT_WORKBOOK_DATA = {
  id: "workbook-01", // Sheet 的唯一标识符
  locale: LocaleType.EN_US, //文档的语言环境
  name: "universheet", //Sheet 的名称
  // styles: //样式
  sheetOrder: ["sheet-01", "sheet-02", "sheet-03"], //表示工作表顺序的工作表 ID 数组
  appVersion: "3.0.0-alpha", //版本
  sheets: {
    "sheet-01": {
      type: SheetTypes.GRID,
      id: "sheet-01", //工作表的唯一标识符
      cellData: {
        //单元格内容
        "0": {
          "0": {
            v: "Hello World",
          },
        },
      },
      // rowData: {},//行数据对象的数组
      name: "sheet1", //工作表的名称
      // tabColor: "red",//工作表标签的颜色
      hidden: BooleanNumber.FALSE, //工作表是否隐藏。默认值：BooleanNumber.FALSE
      rowCount: 1000, //总行数
      columnCount: 20, //总列数。
      // freeze: { xSplit: 1, ySplit: 1, startRow: 1, startColumn: 1 },//冻结窗格设置
      // "mergeData": [],//合并单元格范围的数组
      zoomRatio: 1,
      scrollTop: 200,
      scrollLeft: 100,
      defaultColumnWidth: 93, //列的默认宽度
      defaultRowHeight: 27, //行的默认高度
      status: 1,
      showGridlines: 1, //是否显示网格线
      hideRow: [],
      hideColumn: [],
      rowHeader: {
        //行标题配置{ width: number; hidden?: BooleanNumber; }
        width: 46,
        hidden: BooleanNumber.FALSE,
      },
      columnHeader: {
        //列标题配置{ height: number; hidden?: BooleanNumber; }
        height: 20,
        hidden: BooleanNumber.FALSE,
      },
      selections: ["A2"],
      rightToLeft: BooleanNumber.FALSE, //工作表是否为从右到左模式
      pluginMeta: {},
      //defaultStyle 默认工作表样式
    },
    "sheet-02": {
      type: SheetTypes.GRID,
      id: "sheet-02",
      name: "sheet2",
      cellData: {},
    },
    "sheet-03": {
      type: SheetTypes.GRID,
      id: "sheet-03",
      name: "sheet3",
      cellData: {},
    },
  },
};
