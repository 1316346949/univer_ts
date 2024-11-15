<script setup lang="ts">
import { ref, onMounted, reactive, watch, onUnmounted } from "vue";
import {
  Univer,
  UniverInstanceType,
  Workbook,
  ICommandService,
  LocaleType,
  IWorkbookData,
  IPermissionService,
  IUniverInstanceService,
  ICellData,  //单元格数据结构。
  IStyleData,  //单元格样式。
  DependentOn,
  IRowData,
} from "@univerjs/core";
import { zhCN, enUS } from "univer:locales";
import { defaultTheme } from "@univerjs/design";
// 自定义公式插件
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverUIPlugin, ComponentManager } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsFormulaUIPlugin } from "@univerjs/sheets-formula-ui";
import { UniverSheetsUIPlugin, SetRangeBoldCommand } from "@univerjs/sheets-ui";
import { FUniver } from "@univerjs/facade";
import { ClickOperation } from "../plugin/commands/my-command";
import { UniverSheetsCustomMenuPlugin } from '../plugin';
import { UniverDrawingPlugin } from "@univerjs/drawing";
import { UniverDrawingUIPlugin } from "@univerjs/drawing-ui";
import { UniverSheetsDrawingPlugin } from "@univerjs/sheets-drawing";
import { UniverSheetsDrawingUIPlugin } from "@univerjs/sheets-drawing-ui";
import { CustomerService } from "../plugin/service/service";
// import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor'
// import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt'

// import * as XLSX from "xlsx-js-style";
import ExcelJS from 'exceljs';
import {
  UniverSheetsPlugin,
  WorkbookEditablePermission, //编辑权限
  getSheetCommandTarget,
  SheetsSelectionsService,
  AddRangeProtectionMutation,
  RangeProtectionPermissionEditPoint,
  DeleteRangeProtectionMutation,
} from "@univerjs/sheets";
import { DEFAULT_WORKBOOK_DATA } from "../default-workbook-data";
import { useStore } from 'vuex';

const store = useStore();
onMounted(() => {
  init();
});
let univerAPI: any;
let univer: any;
let univerRef = ref(null)
let workbook = ref(null)

const init = () => {
  univer = new Univer({
    theme: defaultTheme,
    locale: LocaleType.ZH_CN,
    locales: {
      [LocaleType.ZH_CN]: zhCN,
    },
  });
  univerAPI = FUniver.newAPI(univer);
  univerRef.value = univer;
  console.log(univerAPI, 'univerAPIuniverAPIuniverAPIuniverAPI');

  // const permission = univerAPI.getPermission();
  // permission.setPermissionDialogVisible(false);

  //渲染插件
  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);

  //自定义插件
  univer.registerPlugin(UniverSheetsCustomMenuPlugin);

  //ui插件
  univer.registerPlugin(UniverUIPlugin, {
    container: "app1",
    disableAutoFocus: true,
  });

  univer.registerPlugin(UniverDocsPlugin);
  univer.registerPlugin(UniverDocsUIPlugin);
  // 表格插件
  univer.registerPlugin(UniverSheetsPlugin);
  // 表格ui插件
  univer.registerPlugin(UniverSheetsFormulaPlugin);
  univer.registerPlugin(UniverSheetsFormulaUIPlugin);
  // 表格禅道模式
  // univer.registerPlugin(UniverSheetsNumfmtPlugin)
  // univer.registerPlugin(UniverSheetsZenEditorPlugin)


  univer.registerPlugin(UniverDrawingPlugin);
  univer.registerPlugin(UniverDrawingUIPlugin);
  univer.registerPlugin(UniverSheetsDrawingPlugin);
  univer.registerPlugin(UniverSheetsDrawingUIPlugin);

  //隐藏菜单栏
  univer.registerPlugin(UniverSheetsUIPlugin, {
    menu: {
      ['sheet.menu.image']: {//sheet.menu.image
        hidden: true,
      },
      // [SetRangeBoldCommand.id]: {//加粗按钮隐藏
      //   hidden: true,
      // },
    },
  })

  // 创建excel工作簿
  workbook.value = univer.createUnit(UniverInstanceType.UNIVER_SHEET, DEFAULT_WORKBOOK_DATA);
  // workbook.value = univer.createUnit<IWorkbookData, Workbook>(UniverInstanceType.UNIVER_SHEET, data)
  // 你应该在合适的时机（比如univer加载完成）注册组件

};
let excelDom: HTMLElement | null;
onMounted(() => {
  //双击编辑事件
  const timer = setInterval(() => {
    excelDom = document.getElementById('univer-sheet-main-canvas_workbook-01')
    if (excelDom) {
      clearInterval(timer)
      excelDom.addEventListener('dblclick', dblclickFn)
    }
  }, 100)
})

// onUnmounted(() => excelDom!.removeEventListener('dblclick', dblclickFn))

function dblclickFn() {
  const injector = univer.__getInjector()
  const sheetSelectionManagerService = injector.get(SheetsSelectionsService);
  const ranges = sheetSelectionManagerService
    .getCurrentSelections()
    .map((selection: { range: [any] }) => selection.range);
  console.log("🚀 ~ handler: ~ accessor:", ranges);
}

const destroyUniver = () => {
  // toRaw(univerRef.value)?.dispose();
  // univerRef.value = null;
  // workbook.value = null;
};

/**
 * Get workbook data
 */
const getData = () => {
  if (!workbook.value) {
    throw new Error("Workbook is not initialized");
  }
  return workbook.value.save();
};

// 禁用表格
function permissionFn() {
  const injector = univer.__getInjector();
  // 权限服务
  const permissionService = injector.get(IPermissionService);
  const univerInstanceService = injector.get(IUniverInstanceService);
  //获取sheet实例
  const workbook = univerInstanceService.getCurrentUnitForType(
    UniverInstanceType.UNIVER_SHEET
  );

  if (!workbook) {
    return;
  }
  // 获取sheet实例unitId
  const unitId = workbook.getUnitId();
  // 通过uid获取sheet的可编辑权限信息如：
  // id : "1.1_workbook-01"
  // status : "init"
  // subType : 1
  // type : 1
  // unitId : "workbook-01"
  // value : true
  const workbookPermissionInstance = new WorkbookEditablePermission(unitId);
  let permissionPoint = permissionService.getPermissionPoint(
    workbookPermissionInstance.id
  );
  console.log("🚀 ~ permissionFn ~ workbookPermissionInstance:", workbookPermissionInstance)
  console.log("🚀 ~ permissionFn ~ permissionPoint:", permissionPoint)
  // if (!permissionPoint) {
  //   permissionService.addPermissionPoint(workbookPermissionInstance);
  //   permissionPoint = workbookPermissionInstance;
  // }
  permissionService.updatePermissionPoint(
    workbookPermissionInstance.id,
    !permissionPoint.value
  );
}

// 禁用方法
// 单元格权限
function rangesPermissionFn() {
  const accessor = univer.__getInjector();
  const univerInstanceService = accessor.get(IUniverInstanceService);
  const commandService = accessor.get(ICommandService);
  const sheetSelectionManagerService = accessor.get(SheetsSelectionsService);
  const target = getSheetCommandTarget(univerInstanceService);
  if (!target) {
    return;
  }
  const { unitId, subUnitId } = target;
  console.log("🚀 ~ rangesPermissionFn ~ targetssss:", target)
  // let sid = "3xtfxG1" + Date.now()
  // 获取需要冻结选中的区域
  //ranges返回
  //endColumn,endRow,startRow,startRow表示选中的开始列开始行，结束列结束行
  const ranges = sheetSelectionManagerService
    .getCurrentSelections()
    .map((selection: any) => selection.range);
  console.log("🚀 ~ rangesPermissionFn ~ ranges:", ranges)

  commandService.executeCommand(AddRangeProtectionMutation.id, {
    unitId,
    subUnitId,
    rules: [
      {
        permissionId: '3xtfxG1', //此id是自定义的权限id，更新权限id时必填，否则出现单元格只存在虚线，还会出现可编辑。
        name: "sheet1",
        unitType: 3,
        unitId,
        subUnitId,
        ranges,
        id: "rule1",
      },
      // 一次性禁用多个单元格
      {
        permissionId: 'sdasasf',
        name: "sheet1",
        unitType: 3,
        unitId,
        subUnitId,
        ranges: [{
          endColumn: 2,
          endRow: 2,
          rangeType: 0,
          sheetId: "sheet-01",
          startColumn: 2,
          startRow: 2,
        }],
        id: "rule2",
      }
    ],
  });
  const permissionService = accessor.get(IPermissionService);
  permissionService.updatePermissionPoint(
    new RangeProtectionPermissionEditPoint(unitId, subUnitId, '3xtfxG1').id,//传入具体id时，代表用户模式，此单元格无法编辑
    false
  );
  // 当不去调用permissionService.updatePermissionPoint时代表管理员模式，可以出现禁用单元格虚线，但是还可以编辑
  //调用permissionService.updatePermissionPoint，并传入正确id后，代表用户模式，出现虚线，并无法编辑。
  // permissionService.updatePermissionPoint(
  //   new RangeProtectionPermissionEditPoint(unitId, subUnitId, 'sdasasf').id,
  //   false
  // );
  // 依次锁定几个单元格就需要调用permissionService.updatePermissionPoint(xxxx)几次
  // 下面调用方法无效，无法冻结单元格
  // permissionService.updatePermissionPoint(
  //   [
  //     new RangeProtectionPermissionEditPoint(unitId, subUnitId, '3xtfxG1').id,
  //     new RangeProtectionPermissionEditPoint(unitId, subUnitId, 'sdasasf').id
  //   ],
  //   false
  // )
}
// 删除单元格权限
function deleteRangesPermissionFn() {
  const injector = univer.__getInjector();
  const univerInstanceService = injector.get(IUniverInstanceService);
  const commandService = injector.get(ICommandService);
  const target = getSheetCommandTarget(univerInstanceService);
  if (!target) {
    return;
  }
  const { unitId, subUnitId } = target;
  // 获取需要解除冻结选中的区域
  commandService.executeCommand(DeleteRangeProtectionMutation.id, {
    unitId,
    subUnitId,
    ruleIds: ["rule1", 'rule2'],
  });
}
defineExpose({
  getData,
  destroyUniver,
  permissionFn,
  rangesPermissionFn,
  deleteRangesPermissionFn,
});
const drawer = ref(false)
// 打开抽屉
watch(
  () => store.state.range, // 监听 state 中的 count
  (newVal, oldVal) => {
    drawer.value = true
  }
);

// 转换颜色值
function argbToHex(argb: string): string {
  // 提取 ARGB 中的 R、G、B 部分
  const red = argb.slice(2, 4);    // 取红色部分
  const green = argb.slice(4, 6);  // 取绿色部分
  const blue = argb.slice(6, 8);   // 取蓝色部分

  // 拼接成 #RRGGBB 格式并返回
  return `#${red}${green}${blue}`;
}

// 转换合并单元格的对象
const columnLetterToIndex = (column: string): number => {
  let columnIndex = 0;
  for (let i = 0; i < column.length; i++) {
    columnIndex = columnIndex * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return columnIndex - 1; // Convert to zero-based index
};

// Function to convert merge ranges to required format
const convertMerges = (merges: string[]): any[] => {
  const mergeData = merges.map((merge) => {
    // Split 成['B1', 'C1']
    const [start, end] = merge.split(':');

    //['B1', 'C1']->B为列数，1为行数
    //取出开始的列数和行数
    const startColumn = columnLetterToIndex(start.replace(/[0-9]/g, ''));
    //行数需要减一，从0开始
    const startRow = parseInt(start.replace(/[A-Z]/g, ''), 10) - 1;
    //去除结束的列和行数
    const endColumn = columnLetterToIndex(end.replace(/[0-9]/g, ''));
    //行数需要减一，从0开始
    const endRow = parseInt(end.replace(/[A-Z]/g, ''), 10) - 1;

    return {
      startRow,
      startColumn,
      endRow,
      endColumn
    };
  });

  return mergeData;
};

// 辅助函数：将列索引转为 Excel 字母表示
function getColumnLetter(colIndex) {
  let letter = '';
  let temp;
  while (colIndex >= 0) {
    temp = colIndex % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
}

const handleFileChange = async (event) => {
  const file = event.target.files[0];

  if (file) {
    const workbook = new ExcelJS.Workbook(); // 创建一个工作簿对象
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target.result;

      // 读取 Excel 文件
      await workbook.xlsx.load(buffer);

      // 获取第一个工作表
      const worksheet = workbook.worksheets[0];

      // 获取行高
      const jsonData = [];

      // 遍历工作表的每一行
      worksheet.eachRow((row, rowIndex) => {
        const rowData = [];
        const rowHeight = worksheet.getRow(rowIndex).height; // 获取行的高度

        // 遍历每一列
        row.eachCell((cell, colIndex) => {
          if (!cell.value) return
          const columnWidth = worksheet.getColumn(1).width; // 获取列的宽度

          const cellData = {
            // 获取单元格位置，如 A1、B2 等
            position: `${getColumnLetter(colIndex - 1)}${rowIndex}`,
            value: cell.value, // 存储单元格的值
            style: {}, // 存储单元格的样式
            columnWidth,
            rowHeight
          };

          // 获取字体样式
          if (cell.style.font) {
            const fontStyle = cell.style.font;
            if (fontStyle?.color?.argb) {
              fontStyle.color.argb = fontStyle.color.argb
            }
            cellData.style.font = cell.style.font;
          }

          // 获取填充（背景色）样式
          if (cell.style.fill) {
            cellData.style.fill = cell.style.fill;
            const fillStyle = cell.style.fill;

            // 检查 fgColor 是否存在
            if (fillStyle.fgColor) {
              if (fillStyle.fgColor.argb) {
                // 使用 fgColor.argb 获取颜色值
                cellData.style.fill = { argb: fillStyle.fgColor.argb };
              } else if (fillStyle.fgColor.indexed) {
                // 如果使用的是索引颜色，获取索引值
                cellData.style.fill = { indexed: fillStyle.fgColor.indexed };
              }
            }
          }

          // 获取边框样式
          if (cell.style.border) {
            cellData.style.border = cell.style.border;
          }

          // 获取对齐样式
          if (cell.style.alignment) {
            cellData.style.alignment = cell.style.alignment;
          }

          // 将单元格数据添加到当前行数据中
          rowData.push(cellData);
        });

        // 将当前行数据添加到 JSON 数据中
        rowData.length && jsonData.push(rowData);//theme: 1是excel默认或预定颜色
      });

      console.log("🚀 ~ worksheet.eachRow ~ jsonData:", jsonData)
      // 获取所有的合并单元格区域
      const merges = worksheet.model.merges
      console.log('Merged Ranges:', merges);
      console.log('Merged Ranges:', convertMerges(merges));
      // 输出 JSON 数据
    };

    reader.readAsArrayBuffer(file);
  }

};
</script>

<template>
  <div class="box">
    <div id="app1"></div>
    <input type="file" @change="handleFileChange" />
  </div>
  <el-drawer :show-close="true" :close-on-click-modal="true" :modal="true" v-model="drawer" title="I am the title"
    :with-header="false">
    <span>{{ store.getters.getRange }}</span>
  </el-drawer>
</template>

<style scoped>
#app1 {
  width: 100vw;
  height: 800px;
}

.box {
  position: relative;
}

.xuanfu {
  width: 200px;
  background-color: black;
  color: white;
}
</style>
