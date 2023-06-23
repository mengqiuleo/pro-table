import { describe, expect, it, vi } from 'vitest';
import { filterEnum, formatValue, findItemNested, handleProp, handleRowAccordingToProp } from '../index'

describe('utils', () => {
  it('handleRowAccordingToProp handles non-nested prop correctly', () => {
    const row = { id: 1, name: 'John Doe' };
    const prop = 'name';
    const result = handleRowAccordingToProp(row, prop);
    expect(result).toBe('John Doe');
  });

  //处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
  it('handleRowAccordingToProp', () => {
    const row = { user: { detail: { age: 30 } } };
    const prop = 'user.detail.age';
    const result = handleRowAccordingToProp(row, prop);
    expect(result).toBe(30);
  });

  //递归查找 callValue 对应的 enum 值
  it('findItemNested correctly finds nested item', () => {
    const enumData = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two', children: [{ value: 21, label: 'Twenty One' }] },
    ];
    const callValue = 21;
    const value = 'value';
    const children = 'children';
    const result = findItemNested(enumData, callValue, value, children);
    expect(result).toEqual({ value: 21, label: 'Twenty One' });
  });
  
  it('filterEnum correctly filters enum data', () => {
    const enumData = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two', tagType: 'success' },
    ];
    const callValue = 2;
    const fieldNames = { value: 'value', label: 'label', children: 'children' };
    const result = filterEnum(callValue, enumData, fieldNames);
    expect(result).toBe('Two');
  });

  it('formatValue properly formats array', () => {
    const arr = ['apple', 'banana', 'orange'];
    const result = formatValue(arr);
    expect(result).toBe('apple / banana / orange');
  });

  it('formatValue returns -- for undefined', () => {
    const result = formatValue(undefined);
    expect(result).toBe('--');
  });
  
  it('handleProp returns last prop in chain', () => {
    const prop = 'user.detail.age';
    const result = handleProp(prop);
    expect(result).toBe('age');
  });

  it('handleProp returns prop if not nested', () => {
    const prop = 'name';
    const result = handleProp(prop);
    expect(result).toBe('name');
  });
})