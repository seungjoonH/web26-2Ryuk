import { describe, it, expect } from 'vitest';
import IS from './is';

describe('IS', () => {
  it('문자열(string) 판별', () => {
    expect(IS.string('hello')).toBe(true);
    expect(IS.string(123)).toBe(false);
    expect(IS.string(null)).toBe(false);
  });

  it('함수(function) 판별', () => {
    expect(IS.function(() => {})).toBe(true);
    expect(IS.function(function fn() {})).toBe(true);
    expect(IS.function(123)).toBe(false);
  });

  it('객체(object) 판별 (배열, null 제외)', () => {
    expect(IS.object({ a: 1 })).toBe(true);
    expect(IS.object([1, 2, 3])).toBe(false);
    expect(IS.object(null)).toBe(false);
  });

  it('불리언(boolean) 판별', () => {
    expect(IS.boolean(true)).toBe(true);
    expect(IS.boolean(false)).toBe(true);
    expect(IS.boolean('true')).toBe(false);
  });

  it('숫자(number) 판별 (NaN 제외)', () => {
    expect(IS.number(0)).toBe(true);
    expect(IS.number(3.14)).toBe(true);
    expect(IS.number(NaN)).toBe(false);
    expect(IS.number('1')).toBe(false);
  });

  it('numeric (숫자 또는 숫자형 문자열) 판별', () => {
    // 숫자 자체
    expect(IS.numeric(0)).toBe(true);
    expect(IS.numeric(-3.2)).toBe(true);
    expect(IS.numeric(42)).toBe(true);

    // 숫자로 해석 가능한 문자열
    expect(IS.numeric('0')).toBe(true);
    expect(IS.numeric('1')).toBe(true);
    expect(IS.numeric('-2')).toBe(true);
    expect(IS.numeric('3.14')).toBe(true);
    expect(IS.numeric('  7  ')).toBe(true);

    // 숫자가 아닌 문자열
    expect(IS.numeric('abc')).toBe(false);
    expect(IS.numeric('12a')).toBe(false);
    expect(IS.numeric('')).toBe(false);
    expect(IS.numeric(' ')).toBe(false);

    // 그 외 타입
    expect(IS.numeric(null)).toBe(false);
    expect(IS.numeric(undefined)).toBe(false);
    expect(IS.numeric(true)).toBe(false);
    expect(IS.numeric([])).toBe(false);
  });

  it('배열(array) 판별', () => {
    expect(IS.array([])).toBe(true);
    expect(IS.array([1, 2, 3])).toBe(true);
    expect(IS.array({})).toBe(false);
  });

  it('null 판별', () => {
    expect(IS.null(null)).toBe(true);
    expect(IS.null(undefined)).toBe(false);
    expect(IS.null(0)).toBe(false);
  });

  it('undefined 판별', () => {
    expect(IS.undefined(undefined)).toBe(true);
    expect(IS.undefined(null)).toBe(false);
    expect(IS.undefined('')).toBe(false);
  });

  it('nil (null 또는 undefined) 판별', () => {
    expect(IS.nil(null)).toBe(true);
    expect(IS.nil(undefined)).toBe(true);
    expect(IS.nil(0)).toBe(false);
    expect(IS.nil('')).toBe(false);
  });
});
