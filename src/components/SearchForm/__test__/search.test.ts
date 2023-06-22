import { mount } from "@vue/test-utils";
import SearchForm from "../index.vue";
import { describe, expect, it, vi } from 'vitest';

describe('SearchForm', () => {
  it("renders with columns", () => {
    const wrapper = mount(SearchForm, {
      props: {
        columns: [
          { prop: "id", label: "ID",  search: { el: "input" } },
          { prop: "idCard", label: "身份证号", search: { el: "input" } }
        ],
        searchParam: {},
        searchCol: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
        search: vi.fn(),
        reset: vi.fn()
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
})