<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import {
  Univer,
  UniverInstanceType,
  Workbook,
  ICommandService,
  LocaleType,
  IWorkbookData,
  IPermissionService,
  IUniverInstanceService,
  setDependencies,
  ICellData,  //单元格数据结构。
  IStyleData  //单元格样式。

} from "@univerjs/core";
import { zhCN, enUS } from "univer:locales";
import { defaultTheme } from "@univerjs/design";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverUIPlugin, ComponentManager } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsFormulaUIPlugin } from "@univerjs/sheets-formula-ui";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { FUniver } from "@univerjs/facade";
import { ClickOperation } from "../plugin/commands/my-command";
import { UniverSheetsCustomMenuPlugin } from '../plugin';
import { UniverDrawingPlugin } from "@univerjs/drawing";
import { UniverDrawingUIPlugin } from "@univerjs/drawing-ui";
import { UniverSheetsDrawingPlugin } from "@univerjs/sheets-drawing";
import { UniverSheetsDrawingUIPlugin } from "@univerjs/sheets-drawing-ui";
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


// 导入导出
import '@univerjs-pro/exchange-client/lib/index.css';
import { UniverExchangeClientPlugin } from '@univerjs-pro/exchange-client';
import { UniverSheetsExchangeClientPlugin } from '@univerjs-pro/sheets-exchange-client';
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


  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);

  //自定义插件
  univer.registerPlugin(UniverSheetsCustomMenuPlugin);

  univer.registerPlugin(UniverUIPlugin, {
    container: "app1",
  });

  univer.registerPlugin(UniverDocsPlugin);
  univer.registerPlugin(UniverDocsUIPlugin);

  univer.registerPlugin(UniverSheetsPlugin);
  univer.registerPlugin(UniverSheetsUIPlugin);
  univer.registerPlugin(UniverSheetsFormulaPlugin);
  univer.registerPlugin(UniverSheetsFormulaUIPlugin);

  univer.registerPlugin(UniverDrawingPlugin);
  univer.registerPlugin(UniverDrawingUIPlugin);
  univer.registerPlugin(UniverSheetsDrawingPlugin);
  univer.registerPlugin(UniverSheetsDrawingUIPlugin);
  // 导入导出
  univer.registerPlugin(UniverExchangeClientPlugin);
  univer.registerPlugin(UniverSheetsExchangeClientPlugin);

  // 创建excel工作簿
  workbook.value = univer.createUnit(UniverInstanceType.UNIVER_SHEET, DEFAULT_WORKBOOK_DATA);
  // workbook.value = univer.createUnit<IWorkbookData, Workbook>(UniverInstanceType.UNIVER_SHEET, data)
  // 你应该在合适的时机（比如univer加载完成）注册组件

  document.body.ondblclick = () => {
    const injector = univer.__getInjector()
    const commandService = injector.get(ICommandService);
    const sheetSelectionManagerService = injector.get(SheetsSelectionsService);
    const ranges = sheetSelectionManagerService
      .getCurrentSelections()
      .map((selection) => selection.range);
    console.log("🚀 ~ handler: ~ accessor:", ranges);
    // alert(123)
  }
};
console.log("🚀 ~ init ~ univerAPI:", univerAPI)
console.log("🚀 ~ init ~ univerAPI:", univerAPI)
console.log("🚀 ~ init ~ univerAPI:", univerAPI)

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
  if (!permissionPoint) {
    permissionService.addPermissionPoint(workbookPermissionInstance);
    permissionPoint = workbookPermissionInstance;
  }
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
    new RangeProtectionPermissionEditPoint(unitId, subUnitId, 'sdasasf').id,//传入具体id时，代表用户模式，此单元格无法编辑
    false
  );
  // 当不去调用permissionService.updatePermissionPoint时代表管理员模式，可以出现禁用单元格虚线，但是还可以编辑
  //调用permissionService.updatePermissionPoint，并传入正确id后，代表用户模式，出现虚线，并无法编辑。
  // permissionService.updatePermissionPoint(
  //   new RangeProtectionPermissionEditPoint(unitId, subUnitId, 'sdasasf').id,
  //   false
  // );
}
// 删除单元格权限
function deleteRangesPermissionFn() {
  const injector = univer.__getInjector();
  const univerInstanceService = injector.get(IUniverInstanceService);
  const accessor = univer.__getInjector();
  const commandService = accessor.get(ICommandService);
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
function isCellMerged(cellAddress, merges) {
  for (let merge of merges) {
    const start = XLSX.utils.encode_cell(merge.s);
    const end = XLSX.utils.encode_cell(merge.e);
    if (cellAddress >= start && cellAddress <= end) {
      return {
        start: start,
        end: end
      };
    }
  }
  return null;
}
const handleFileChange = async (event) => {
  const file = event.target.files[0];

  if (file) {
    const workbook = new ExcelJS.Workbook(); // 创建一个工作簿对象
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target.result;
      const workbook = new ExcelJS.Workbook();

      // 读取 Excel 文件
      await workbook.xlsx.load(buffer);

      // 获取第一个工作表
      const worksheet = workbook.worksheets[0];

      const jsonData = [];

      // 遍历工作表的每一行
      worksheet.eachRow((row, rowIndex) => {
        const rowData = [];

        // 遍历每一列
        row.eachCell((cell, colIndex) => {
          const cellData = {
            value: cell.value, // 存储单元格的值
            style: {} // 存储单元格的样式
          };

          // 获取字体样式
          if (cell.style.font) {
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
            console.log("🚀 ~ row.eachCell ~ cell.style.fill:", cell.style.fill)
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
        jsonData.push(rowData);
      });
      console.log("🚀 ~ worksheet.eachRow ~ jsonData:", jsonData)

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
