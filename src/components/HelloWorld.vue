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
  setDependencies
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
import { UniverExchangeClientPlugin } from "@univerjs-pro/exchange-client";
import { UniverSheetsExchangeClientPlugin } from "@univerjs-pro/sheets-exchange-client";
import { UniverDrawingPlugin } from "@univerjs/drawing";
import { UniverDrawingUIPlugin } from "@univerjs/drawing-ui";
import { UniverSheetsDrawingPlugin } from "@univerjs/sheets-drawing";
import { UniverSheetsDrawingUIPlugin } from "@univerjs/sheets-drawing-ui";
import * as XLSX from "xlsx";
import {
  UniverSheetsPlugin,
  WorkbookEditablePermission, //编辑权限
  getSheetCommandTarget,
  SheetsSelectionsService,
  AddRangeProtectionMutation,
  RangeProtectionPermissionEditPoint,
  DeleteRangeProtectionMutation,
} from "@univerjs/sheets";
import { DEFAULT_WORKBOOK_DATA } from "../default-workbook-data.ts";
import { useStore } from 'vuex';

const store = useStore();
onMounted(() => {
  init();
});
let univerAPI: any;
let univer: any;
const init = () => {
  univer = new Univer({
    theme: defaultTheme,
    locale: LocaleType.ZH_CN,
    locales: {
      [LocaleType.ZH_CN]: zhCN,
    },
  });
  univerAPI = FUniver.newAPI(univer);
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
  univer.createUnit(UniverInstanceType.UNIVER_SHEET, DEFAULT_WORKBOOK_DATA);

  univer.registerPlugin(UniverExchangeClientPlugin);
  univer.registerPlugin(UniverSheetsExchangeClientPlugin);
  univer.registerPlugin(UniverDrawingPlugin);
  univer.registerPlugin(UniverDrawingUIPlugin);
  univer.registerPlugin(UniverSheetsDrawingPlugin);
  univer.registerPlugin(UniverSheetsDrawingUIPlugin);

  // 你应该在合适的时机（比如univer加载完成）注册组件

  document.body.ondblclick = () => {
    const injector = univer.__getInjector()
    const commandService = injector.get(ICommandService);
    const sheetSelectionManagerService = injector.get(SheetsSelectionsService);
    const ranges = sheetSelectionManagerService
      .getCurrentSelections()
      .map((selection) => selection.range);
    console.log("🚀 ~ handler: ~ accessor:", ranges);
    alert(123)
  }
};

const destroyUniver = () => {
  // toRaw(univerRef.value)?.dispose();
  // univerRef.value = null;
  // workbook.value = null;
};

/**
 * Get workbook data
 */
const getData = () => {
  // if (!workbook.value) {
  //   throw new Error("Workbook is not initialized");
  // }
  // return workbook.value.save();
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
    .map((selection) => selection.range);
  commandService.executeCommand(AddRangeProtectionMutation.id, {
    unitId,
    subUnitId,
    rules: [
      {
        permissionId: '"3xtfxG1"', //此id是自定义的权限id，删除选中的单元格的权限，需要此id。
        name: "sheet1",
        unitType: 3,
        unitId,
        subUnitId,
        ranges,
        id: "rule1",
      },
    ],
  });
  const permissionService = accessor.get(IPermissionService);
  permissionService.updatePermissionPoint(
    new RangeProtectionPermissionEditPoint(unitId, subUnitId, '"3xtfxG1"').id,
    false
  );
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
  // 获取需要冻结选中的区域
  commandService.executeCommand(DeleteRangeProtectionMutation.id, {
    unitId,
    subUnitId,
    ruleIds: ["rule1"],
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

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary", cellStyles: true });

      // 获取第一个工作表
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // 将工作表数据转换为 JSON 格式并保留样式
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      const styledData = jsonData.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
          const cellObj = worksheet[cellAddress];

          // 获取样式：例如加粗、字体颜色等
          let style = {};
          if (cellObj && cellObj.s) {
            const styleObj = cellObj.s;
            if (styleObj.font && styleObj.font.bold) {
              style.fontWeight = 'bold';
            }
            if (styleObj.font && styleObj.font.color) {
              style.color = styleObj.font.color.rgb ? `#${styleObj.font.color.rgb}` : styleObj.font.color.rgb;
            }
            if (styleObj.fill && styleObj.fill.fgColor) {
              style.backgroundColor = `#${styleObj.fill.fgColor.rgb}`;
            }
          }

          return { value: cell, style };
        });
      });
      // 将工作表转为 JSON 格式
      console.log("导入的数据：", jsonData);
      console.log("styledDatastyledDatastyledDatastyledData", styledData);

      // 你可以在这里将数据保存到 Vuex 或其他状态管理工具中
    };

    reader.readAsBinaryString(file);  // 读取文件为二进制字符串
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
