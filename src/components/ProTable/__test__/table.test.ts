import { mount } from "@vue/test-utils";
import ProTable from "../index.vue";
import { describe, expect, it, vi } from 'vitest';

describe('SearchForm', () => {
  it("renders with columns", () => {
    const columns = [
      { type: "selection", fixed: "left", width: 80 },
      { type: "index", label: "#", width: 80 },
      { type: "expand", label: "Expand", width: 100 },
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
      { prop: "idCard", label: "身份证号", search: { el: "input" } },
      { prop: "email", label: "邮箱" },
      { prop: "address", label: "居住地址" },
      { prop: "operation", label: "操作", fixed: "right", width: 330 }
    ];
    const wrapper = mount(ProTable, {
      props: {
        columns
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
})