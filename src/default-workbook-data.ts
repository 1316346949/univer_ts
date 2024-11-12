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
  // styles{

  //   tr?: Nullable<ITextRotation> 该字段用于设置单元格中文本的旋转角度。它可以定义文本在单元格内的旋转角度，以便更灵活地控制文本的显示方向。
  //   类型：ITextRotation，表示文本旋转的具体信息，通常包括角度值等。

  //   td?: Nullable<TextDirection>
  //   该字段定义文本的方向。它决定了文本在单元格中的显示方向，常见的方向包括从左到右（LTR）或从右到左（RTL），例如用于支持不同语言的显示。
  //   类型：TextDirection，通常是一个枚举类型，表示文本的显示方向。

  //   ht?: Nullable<HorizontalAlign> 该字段用于定义文本的 水平对齐方式。水平对齐方式可以是左对齐、居中对齐、右对齐等。
  //   HorizontalAlign，通常是一个枚举类型，表示不同的水平对齐方式。

  //   vt?: Nullable<VerticalAlign> 该字段用于定义文本的 垂直对齐方式。垂直对齐方式决定了文本在单元格内的上下位置，例如顶部对齐、居中对齐或底部对齐。
  //   类型：VerticalAlign，通常是一个枚举类型，表示不同的垂直对齐方式。

  //   tb?: Nullable<WrapStrategy> 该字段用于定义文本的 换行策略。它决定了文本在单元格中超出单元格宽度时如何处理。例如，是否自动换行、截断文本等。
  //   WrapStrategy，通常是一个枚举类型，表示不同的文本换行策略。

  //   pd?: Nullable<IPaddingData> 该字段用于定义单元格的 内边距。内边距控制文本和单元格边缘之间的距离，以使文本内容更易于阅读和排版。
  //   类型：IPaddingData，表示内边距的数据结构，通常包括四个方向（上、右、下、左）的边距设置。

  //  ff?: Nullable<string>  该字段指定字体的 字体族（font family）。比如 "Arial"、"Verdana" 等字体。
  //  fs?: number 该字段定义 字体大小，单位为 磅（pt）
      // 更多参数含义在HelloWorld.vue的IStyleData里，点击进入查看IStyleBase注释
  // }
  //cellData:{
  //p?  // 单元格的 唯一标识符，通常是一个随机字符串。
  //  IDocumentData 可能是一个包含文档数据的接口，或者你可以将其理解为关联到该单元格的数据模型。
  //s?  // Nullable<IStyleData | string> 该字段存储单元格的 样式信息，可以是样式对象（IStyleData）或样式的标识符（string）。样式对象可以包含字体、颜色、对齐方式等样式属性。也可以只是存储样式的字符串标识符，表示样式的唯一 ID。
  // IStyleData 是一个表示样式的接口，或者是样式 ID（如字符串）作为一种简化处理。
  //v?  // Nullable<CellValue> 解释：该字段表示单元格的 原始值。这个值可以是数字、文本或布尔值等，具体取决于单元格内的数据类型。
  // CellValue 可能是一个联合类型，支持不同类型的数据，例如：string | number | boolean | null 等。
  // t?  // Nullable<CellValueType>该字段表示单元格的 值类型。例如，值可能是字符串、数字、日期等。这有助于知道如何正确解析和格式化单元格的值。
  // CellValueType 可能是一个枚举类型，表示不同的单元格数据类型，例如 string、number、date 等
  //f?: // Nullable<string> 该字段存储单元格中的 公式字符串。例如，一个单元格可能包含类似 =SUM(A1:B4) 这样的公式。
  //si?: //Nullable<string> 该字段表示公式的 唯一 ID，用于区分不同的公式。这个字段与 f 字段（公式字符串）配合使用，可以帮助跟踪和识别公式的引用。
  //custom? // 该字段用于存储 用户自定义的数据，可以是任何额外的信息，与单元格的数据无关，可能是应用程序特定的数据。
  //Record<string, any> 表示一个键值对对象，键是字符串，值可以是任何类型的数据。这使得该字段具有灵活性，可以存储任意的自定义信息。
  // }
  sheetOrder: ["sheet-01", "sheet-02", "sheet-03"], //表示工作表顺序的工作表 ID 数组
  appVersion: "3.0.0-alpha", //版本
  styles: {
    "9woN8i": {
      cl: {
        rgb: "#FDC49B",
      },
    },
  },
  sheets: {
    "sheet-01": {
      type: SheetTypes.GRID,
      id: "sheet-01", //工作表的唯一标识符
      cellData: {
        //单元格内容
        "0": {
          "0": {
            v: "Hello World1",
            t: 1,
            s: "9woN8i",
          },
        },
      },
      // rowData: {},//行数据对象的数组
      name: "sheet1", //工作表的名称
      // columnData: {  //列数据对象的数组
      //   "0": {
      //     w: 125,
      //     hd: 0,
      //   },
      //   "1": {
      //     w: 125,
      //     hd: 0,
      //   },
      //   "2": {
      //     w: 125,
      //     hd: 0,
      //   },
      //   "3": {
      //     w: 125,
      //     hd: 0,
      //   },
      //   "4": {
      //     w: 125,
      //     hd: 0,
      //   },
      //   "5": {
      //     w: 125,
      //     hd: 0,
      //   },
      //   "6": {
      //     w: 125,
      //     hd: 0,
      //   },
      //   "7": {
      //     w: 125,
      //     hd: 0,
      //   },
      //   "8": {
      //     w: 125,
      //     hd: 0,
      //   },
      //   "9": {
      //     w: 125,
      //     hd: 0,
      //   },
      // },
      // tabColor: "red",//工作表标签的颜色
      hidden: BooleanNumber.FALSE, //工作表是否隐藏。默认值：BooleanNumber.FALSE
      rowCount: 1000, //总行数
      columnCount: 20, //总列数。
      // freeze: { xSplit: 1, ySplit: 1, startRow: 1, startColumn: 1 },//冻结窗格设置
      // freeze: {
      //   xSplit: 3,
      //   ySplit: 4,
      //   startRow: 4,
      //   startColumn: 2,
      // },
      mergeData: [
        // //合并范围
        {
          startRow: 0,
          startColumn: 0,
          endRow: 0,
          endColumn: 1,
        },
      ],
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
