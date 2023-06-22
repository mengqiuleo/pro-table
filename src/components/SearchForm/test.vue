<script lang="ts" setup>
import { provide, ref } from 'vue';
import { ColumnProps } from '../ProTable/interface';
import SearchForm from './index.vue';

const enumMap = ref(new Map<string, { [key: string]: any }[]>());
enumMap.value.set('gender', [{'value': 'option1', 'label': 'option1'}, {'value': 'option2', 'label': 'option2'}])
enumMap.value.set('status', [{'value': 'option1', 'label': 'option1'}, {'value': 'option2', 'label': 'option2'}])
provide("enumMap", enumMap);

const searchCol = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
const searchColumns: ColumnProps[] = [
  {
    prop: "username",
    label: "用户姓名",
    search: { el: "input" }
  },
  {
    prop: "gender",
    label: "性别",
    // 字典数据
    // enum: genderType,
    // 字典请求不带参数
    enum:  [{value: 'option1', label: 'option1'}, {value: 'option2', label: 'option2'}],
    // 字典请求携带参数
    // enum: () => getUserGender({ id: 1 }),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "genderLabel", value: "genderValue" }
  },
  { prop: "idCard", label: "身份证号", search: { el: "input" } },
  {
    prop: "status",
    label: "用户状态",
    enum: [ { value: 0, label: '禁用' }, { value: 1, label: '启用'} ],
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "userLabel", value: "userStatus" },
  },
  {
    prop: "createTime",
    label: "创建时间",
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  }
];
let searchParam = ref({})
const reset = () => {
  searchParam.value = {}
  console.log('重置')
}
const search = () => {
  console.log('查询参数为', searchParam.value)
}
</script>

<template>
<SearchForm
  :search="search"
  :reset="reset"
  :columns="searchColumns"
  :search-param="searchParam"
  :search-col="searchCol"
/>
</template>