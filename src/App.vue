<script setup lang="ts">
// import GridTest from './components/Grid/test.vue';
// import SearchFormTest from './components/SearchForm/test.vue';
import ProTable from '@/components/ProTable/index.vue';
import { getUserList } from '@/api/index'

const params = {type: 1, pageNum: 1, pageSize: 10, startTime: "2022-11-12 11:35:00", endTime: "2022-12-12 11:35:00"}
console.log(getUserList(params))
</script>

<template>
<div>
  <h1>123</h1>
  <ProTable />
</div>
</template>

<style scoped></style>
