<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx" name="TableColumn">
import { inject, ref, useSlots } from "vue";
import { ColumnProps, RenderScope, HeaderRenderScope } from "@/components/ProTable/interface";
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp } from "@/utils";

defineProps<{ column: ColumnProps }>();

const slots = useSlots(); //获取父组件的插槽
console.log('useSlots', slots)

const enumMap = inject("enumMap", ref(new Map()));
console.log('enumMap', enumMap)

// 渲染表格数据
const renderCellData = (item: ColumnProps, scope: RenderScope<any>) => {
  return enumMap.value.get(item.prop) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop)!, item.fieldNames)
    : formatValue(handleRowAccordingToProp(scope.row, item.prop!));
    //filterEnum: 性别标识为0/1，显示为男、女
    //handleRowAccordingToProp：返回嵌套的最终结果，eg：user.name 返回 name
};

// 获取 tag 类型
const getTagType = (item: ColumnProps, scope: RenderScope<any>) => {
  return filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop), item.fieldNames, "tag");
};

const RenderTableColumn = (item: ColumnProps) => {
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          align={item.align ?? "center"}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
        {/* showOverflowTooltip：溢出隐藏，在鼠标移动到目标元素上时，显示 */}
          {{
            default: (scope: RenderScope<any>) => {
              if (item._children) return item._children.map(child => RenderTableColumn(child));
              if (item.render) return item.render(scope);//自定义渲染内容tsx（eg:启用，禁用）
              //如果存在与列 prop 名称相对应的插槽（通过调用 handleProp 函数计算），则使用当前作用域调用该插槽并返回其结果。插槽允许开发人员为特定列提供自定义渲染函数(eg: createTime)
              if (slots[handleProp(item.prop!)]) return slots[handleProp(item.prop!)]!(scope);
              if (item.tag) return <el-tag type={getTagType(item, scope)}>{renderCellData(item, scope)}</el-tag>;
              return renderCellData(item, scope);
            },
            header: (scope: HeaderRenderScope<any>) => {
              if (item.headerRender) return item.headerRender(scope);//自定义渲染表头 tsx(eg: 创建时间表头)
              if (slots[`${handleProp(item.prop!)}Header`]) return slots[`${handleProp(item.prop!)}Header`]!(scope);//作用域插槽渲染的表头（eg: 用户姓名表头）
              return item.label;
            }
          }}
        </el-table-column>
      )}
    </>
  );
};
</script>
