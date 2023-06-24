<script setup lang="tsx" name="useProTable">
// import GridTest from './components/Grid/test.vue';
// import SearchFormTest from './components/SearchForm/test.vue';
import ProTable from '@/components/ProTable/index.vue';
import { getUserList } from '@/api/index'
import { ColumnProps, HeaderRenderScope, ProTableInstance } from './components/ProTable/interface';
import { ElMessage } from 'element-plus';
import { CirclePlus, Delete, EditPen, View, Refresh, More } from "@element-plus/icons-vue";
import { ref, reactive, computed } from 'vue';

interface ResUserList {
  id: string;
  username: string;
  gender: number;
  user: { detail: { age: number } };
  idCard: string;
  email: string;
  address: string;
  createTime: string;
  status: number;
  avatar: string;
  photo: any[];
  children?: ResUserList[];
}

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<ResUserList>) => {
  return (
    <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
      {scope.column.label}
    </el-button>
  );
};

// 当前选中的数据
const selected = computed(() => proTable.value?.selectedList)
console.log('Protable暴露出来的属性和方法', proTable)
console.log('勾选的数据', selected)


// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  const result =  {
    list: data.data.list,
    total: data.data.total,
    pageNum: data.data.pageNum,
    pageSize: data.data.pageSize
  };
  console.log('data', result)
  return result
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserList(newParams);
};

// 表格配置项
const columns: ColumnProps<ResUserList>[] = [
  { type: "selection", fixed: "left", width: 50 },
  { type: "index", label: "#", width: 50 },
  { type: "expand", label: "Expand", width: 100 },
  {
    prop: "username",
    label: "用户姓名",
    search: { el: "input" },
    render: scope => {
      // 自定义渲染内容
      return (
        <el-button type="primary" link onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}>
          {scope.row.username}
        </el-button>
      );
    }
  },
  {
    prop: "gender",
    label: "性别",
    // 字典数据
    // enum: genderType,
    // 字典请求不带参数
    enum: [{genderLabel: "男", genderValue: 1}, {genderLabel: "女", genderValue: 2}],
    // 字典请求携带参数
    // enum: () => getUserGender({ id: 1 }),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "genderLabel", value: "genderValue" }
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
    search: {
      // 自定义 search 显示内容
      render: ({ searchParam }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <el-input vModel_trim={searchParam.minAge} placeholder="最小年龄" />
            <span style={{ marginRight: '10px', marginLeft: '10px' }}>-</span>
            <el-input vModel_trim={searchParam.maxAge} placeholder="最大年龄" />
          </div>
        );
      }
    }
  },
  { prop: "idCard", label: "身份证号", search: { el: "input" } },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "status",
    label: "用户状态",
    enum: [{userLabel: "启用", userStatus: 1}, {userLabel: "禁用", userStatus: 0}],
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: scope => {
      // 自定义渲染内容
      return (
        <>
        {/* 这里是使用了自定义指令实现权限校验，这里省略 */}
          {true ? (
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  {
    prop: "createTime",
    label: "创建时间",
    headerRender,
    width: 180,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
];

//改变用户状态: 启用/禁用
const changeStatus = (row: any) => {
  ElMessage.success(`row:` + row)
}

// 用户新增/删除
const addUser = () => {
  ElMessage.success('新增用户')
}
const deleteUser = (row: any) => {
  ElMessage.success('删除用户' + row)
}
const openDrawer = (option: any,row: any) => {
  ElMessage.success(option + row)
}
const resetPass = (row: any) => {
  ElMessage.success('重置密码' + row)
}
const deleteAccount = (row: any) => {
  ElMessage.success('删除' + row)
}
const selectedData = (selectedData: any) => {
  // ElMessage.success('选中数据', selectedData)
  console.log(selectedData)
}

</script>

<template>
<div class="content-box">

  <ProTable
    ref="proTable"
    title="用户列表"
    :columns="columns"
    :request-api="getTableList"
    :init-param="initParam"
    :data-callback="dataCallback"
  >
    <!-- 表格 header 按钮 -->
    <template #tableHeader="scope">
      <el-button type="primary" :icon="CirclePlus" @click="addUser()"> 新增用户 </el-button>
      <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="deleteUser(scope.selectedListIds)">
        删除用户
      </el-button>
      <el-button :icon="More" @click="selectedData(scope.selectedList)">选中数据</el-button>
    </template>
    <!-- Expand -->
    <template #expand="scope">
      {{ scope.row }}
    </template>
    <!-- usernameHeader -->
    <template #usernameHeader="scope">
      <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
        {{ scope.column.label }}
      </el-button>
    </template>
    <!-- createTime -->
    <template #createTime="scope">
      <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
        {{ scope.row.createTime }}
      </el-button>
    </template>
    <!-- 表格操作 -->
    <template #operation="scope">
      <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)"> 查看 </el-button>
      <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
      <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)"> 重置密码 </el-button>
      <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)"> 删除 </el-button>
    </template>
  </ProTable>
  <div>{{ selected }}</div>
</div>
</template>

<style>
/* 表格 pagination 样式 */
.el-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* el-table 表格样式 */
.el-table {
  flex: 1;
  height: 350px !important;

  /* 修复 safari 浏览器表格错位 https://github.com/HalseySpicy/Geeker-Admin/issues/83 */
  table {
    width: 100%;
  }
  .el-table__header th {
    height: 45px;
    font-size: 15px;
    font-weight: bold;
    color: var(--el-text-color-primary);
    background: var(--el-fill-color-light);
  }
  .el-table__row {
    height: 45px;
    font-size: 14px;
    .el-table__placeholder {
      display: inline;
    }
  }

  /* 设置 el-table 中 header 文字不换行，并省略 */
  .el-table__header .el-table__cell > .cell {
    white-space: nowrap;
  }

  /* 解决表格数据为空时样式不居中问题(仅在element-plus中) */
  .el-table__empty-block {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .table-empty {
      line-height: 30px;
    }
  }

  /* table 中 image 图片样式 */
  .table-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}

/* table-search 表格搜索样式 */
.table-search {
  padding: 18px 18px 0;
  margin-bottom: 10px;
  .el-form {
    .el-form-item__content > * {
      width: 100%;
    }

    /* 去除时间选择器上下 padding */
    .el-range-editor.el-input__wrapper {
      padding: 0 10px;
    }
  }
  .operation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
}

/* 表格 header 样式 */
.table-header {
  .header-button-lf {
    float: left;
  }
  .header-button-ri {
    float: right;
  }
  .el-button {
    margin-bottom: 15px;
  }
}

/* custom card */
.card {
  box-sizing: border-box;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}

/* ProTable 不需要 card 样式（在组件内使用 ProTable 会使用到） */
.no-card {
  .card {
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
  .table-search {
    padding: 18px 0 0 !important;
    margin-bottom: 0 !important;
  }
}
</style>
