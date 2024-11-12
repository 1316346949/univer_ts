<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import { DEFAULT_WORKBOOK_DATA } from "./default-workbook-data";
import { ref } from "vue";

const data = ref(DEFAULT_WORKBOOK_DATA);
const univerRef = ref<InstanceType<typeof HelloWorld> | null>(null);
const isShow = ref(true);

const getData = () => {
  const result = univerRef.value?.getData();
  console.log(JSON.stringify(result, null, 2));
};
const permissionFn = () => {
  univerRef.value?.permissionFn();
};

const rangesPermissionFn = () => {
  univerRef.value?.rangesPermissionFn();
};
const deleteRangesPermissionFn = () => {
  univerRef.value?.deleteRangesPermissionFn();
};
const destroy = () => {
  isShow.value = false;
};
</script>

<template>
  <div>
    <button @click="getData" title="print current workbook data to console">
      Get Data
    </button>
    <button @click="destroy">destroy</button>
    <button @click="permissionFn">禁用表格</button>
    <button @click="rangesPermissionFn">禁用单元格</button>
    <button @click="deleteRangesPermissionFn">解除禁用单元格</button>
  </div>
  <HelloWorld ref="univerRef" />
</template>

<style scoped></style>
