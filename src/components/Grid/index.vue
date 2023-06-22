<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="Grid">
import {
  ref,
  watch,
  useSlots,
  computed,
  provide,
  onBeforeMount,
  onMounted,
  onUnmounted,
  onDeactivated,
  onActivated,
  VNodeArrayChildren,
  VNode
} from "vue";
import type { BreakPoint } from "./interface/index";

type Props = {
  cols?: number | Record<BreakPoint, number>; //每一行的列数，可以根据不同断点设置不同的列数
  collapsed?: boolean; //是否需要折叠部分内容
  collapsedRows?: number; //折叠后的行数
  gap?: [number, number] | number; //行间距和列间距，可以传入一个数字或者数组，表示不同方向的间距
};

const props = withDefaults(defineProps<Props>(), {
  cols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
  collapsed: false,
  collapsedRows: 1,
  gap: 0
});

onBeforeMount(() => props.collapsed && findIndex());
onMounted(() => {
  resize({ target: { innerWidth: window.innerWidth } } as unknown as UIEvent);
  window.addEventListener("resize", resize);
});
onActivated(() => {
  resize({ target: { innerWidth: window.innerWidth } } as unknown as UIEvent);
  window.addEventListener("resize", resize);
});
onUnmounted(() => {
  window.removeEventListener("resize", resize);
});
onDeactivated(() => {
  window.removeEventListener("resize", resize);
});

// 监听屏幕变化
const resize = (e: UIEvent) => {
  let width = (e.target as Window).innerWidth;
  switch (!!width) {
    case width < 768:
      breakPoint.value = "xs";
      break;
    case width >= 768 && width < 992:
      breakPoint.value = "sm";
      break;
    case width >= 992 && width < 1200:
      breakPoint.value = "md";
      break;
    case width >= 1200 && width < 1920:
      breakPoint.value = "lg";
      break;
    case width >= 1920:
      breakPoint.value = "xl";
      break;
  }
};

// 注入 gap 间距
provide("gap", Array.isArray(props.gap) ? props.gap[0] : props.gap);

// 注入响应式断点
let breakPoint = ref<BreakPoint>("xl");
provide("breakPoint", breakPoint);

// 注入要开始折叠的 index, 这里的折叠是指隐藏，而关于控制换行，是通过 item 的 style
const hiddenIndex = ref(-1);
provide("shouldHiddenIndex", hiddenIndex);

// 注入 cols
const gridCols = computed(() => {
  if (typeof props.cols === "object") return props.cols[breakPoint.value] ?? props.cols;
  return props.cols;
});
provide("cols", gridCols);

// 寻找需要开始折叠的字段 index
const slots = useSlots().default!();
console.log('获取当前组件中默认 slot 的 VNode 数组', slots)

const findIndex = () => {
  let fields: VNodeArrayChildren = [];
  let suffix: VNode | null = null;
  slots.forEach((slot: any) => {
    // suffix: 如果当前遍历到的插槽的 type 字段是 object 类型并且 name 为 "GridItem" 并且有定义 suffix 属性，则将其赋值给 suffix 变量
    if (typeof slot.type === "object" && slot.type.name === "GridItem" && slot.props?.suffix !== undefined) suffix = slot;
    // slot children: 如果当前遍历到的插槽的 type 字段是 symbol 类型并且 children 是一个数组，将 children 数组中的元素 push 到 fields 数组中
    if (typeof slot.type === "symbol" && Array.isArray(slot.children)) fields.push(...slot.children);
  });

  // 计算 suffix 所占用的列
  let suffixCols = 0;
  if (suffix) {
    suffixCols =
      ((suffix as VNode).props![breakPoint.value]?.span ?? (suffix as VNode).props?.span ?? 1) +
      ((suffix as VNode).props![breakPoint.value]?.offset ?? (suffix as VNode).props?.offset ?? 0);
  }
  try {
    let find = false;
    // 遍历 fields 数组，将所有表单字段的 span 和 offset 相加，直到这个值大于等于 (props.collapsedRows * gridCols.value - suffixCols) ，此时 hiddenIndex.value 就是需要隐藏的表单字段索引
    fields.reduce((prev = 0, current, index) => {
      prev +=
        ((current as VNode)!.props![breakPoint.value]?.span ?? (current as VNode)!.props?.span ?? 1) +
        ((current as VNode)!.props![breakPoint.value]?.offset ?? (current as VNode)!.props?.offset ?? 0);
      if (Number(prev) > props.collapsedRows * gridCols.value - suffixCols) {
        hiddenIndex.value = index; // 将需要隐藏的表单字段索引赋值给 hiddenIndex.value
        find = true; // 将 find 变量的值设置为 true
        throw "find it"; // 抛出异常，跳出 reduce 循环
      }
      return prev;
    }, 0);
    if (!find) hiddenIndex.value = -1;
  } catch (e) {
    // console.warn(e);
  }
};

// 断点变化时 执行 findIndex
watch(
  () => breakPoint.value,
  () => {
    if (props.collapsed) findIndex();
  }
);

// 监听 collapsed
watch(
  () => props.collapsed,
  value => {
    if (value) return findIndex();
    hiddenIndex.value = -1;
  }
);

// 设置间距
const gridGap = computed(() => {
  if (typeof props.gap === "number") return `${props.gap}px`;
  if (Array.isArray(props.gap)) return `${props.gap[1]}px ${props.gap[0]}px`;//[行,列]
  return "unset";
});

// 设置 style
const style = computed(() => {
  return {
    display: "grid",
    gridGap: gridGap.value,
    gridTemplateColumns: `repeat(${gridCols.value}, minmax(0, 1fr))`
  };
});

defineExpose({ breakPoint });
</script>
