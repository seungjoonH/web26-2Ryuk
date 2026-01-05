import { describe, it, expect } from 'vitest';
import CSSUtil from './css';

describe('CSSUtil.buildCls', () => {
  it('문자열 인자를 공백으로 구분하여 합친다', () => {
    expect(CSSUtil.buildCls('a', 'b', 'c')).toBe('a b c');
  });

  it("Falsy 값(false, null, undefined, 0, '')은 무시된다", () => {
    expect(CSSUtil.buildCls('a', false, 'b', null, undefined, '', 0, 'c')).toBe('a b c');
  });

  it('숫자나 문자열이 혼합되어도 문자열로 합쳐진다', () => {
    expect(CSSUtil.buildCls('item', 1, 'active', 0)).toBe('item 1 active');
  });

  it('템플릿 문자열도 정상적으로 합쳐진다', () => {
    const dynamic = 'hover';
    expect(CSSUtil.buildCls(`btn ${dynamic}`, 'primary')).toBe('btn hover primary');
  });

  it('조건부 표현식 결과가 false일 경우 무시된다', () => {
    const isActive = false;
    expect(CSSUtil.buildCls('base', isActive && 'active', 'ready')).toBe('base ready');
  });

  it('조건부 표현식 결과가 true일 경우 포함된다', () => {
    const isActive = true;
    expect(CSSUtil.buildCls('base', isActive && 'active', 'ready')).toBe('base active ready');
  });

  it('배열로 전달된 경우에도 평탄화되어 문자열로 합쳐진다 (spread 전제)', () => {
    const classes = ['btn', 'large', null, 'primary'];
    expect(CSSUtil.buildCls(...classes)).toBe('btn large primary');
  });

  it('모든 인자가 falsy면 빈 문자열을 반환한다', () => {
    expect(CSSUtil.buildCls('', null, undefined, false, 0)).toBe('');
  });

  it('단일 truthy 값만 있을 경우 해당 문자열을 반환한다', () => {
    expect(CSSUtil.buildCls('only')).toBe('only');
  });

  it('공백이 포함된 인자들을 적절히 유지하여 합친다', () => {
    expect(CSSUtil.buildCls('a  b', ' c ', 'd')).toBe('a  b  c  d');
  });
});
