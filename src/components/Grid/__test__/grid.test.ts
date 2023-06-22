/**
 * @vitest-environment happy-dom
 */

import { beforeAll, describe, expect, it } from 'vitest';
import { shallowMount, mount  } from "@vue/test-utils";
import Grid from "../index.vue";
import GridItem from '../components/GridItem.vue';

// 注册 GridItem 组件
const globalComponents = {
  'GridItem': GridItem
}

describe('Gird', () => {
  //测试默认属性是否正确设置
  it('sets default props correctly', () => {
    const wrapper = shallowMount(Grid, {
      slots: {
        default: `
          <GridItem>item 1</GridItem>
          <GridItem>item 2</GridItem>
          <GridItem>item 3</GridItem>
        `
      },
      global: {
        components: globalComponents
      }
    })
    expect(wrapper.vm.cols).toEqual({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
    expect(wrapper.vm.collapsed).toBe(false)
    expect(wrapper.vm.collapsedRows).toBe(1)
    expect(wrapper.vm.gap).toBe(0)
    expect(wrapper.findComponent(GridItem).exists()).toBe(true)
    expect(wrapper.findAllComponents(GridItem)).toHaveLength(3)
  });
});
