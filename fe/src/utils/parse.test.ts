import { describe, it, expect } from 'vitest';
import ParseUtil from './parse';

describe('ParseUtil', () => {
  describe('date', () => {
    it('문자열을 Date 객체로 변환한다', () => {
      const dateString = '2024-01-15T10:30:00';
      const result = ParseUtil.date(dateString);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(new Date(dateString).getTime());
    });

    it('ISO 형식 문자열을 Date 객체로 변환한다', () => {
      const isoString = '2024-01-15T10:30:00.000Z';
      const result = ParseUtil.date(isoString);
      expect(result).toBeInstanceOf(Date);
    });

    it('날짜만 포함된 문자열을 Date 객체로 변환한다', () => {
      const dateString = '2024-01-15';
      const result = ParseUtil.date(dateString);
      expect(result).toBeInstanceOf(Date);
    });

    it('이미 Date 객체인 경우 그대로 반환한다', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = ParseUtil.date(date);
      expect(result).toBe(date);
      expect(result).toBeInstanceOf(Date);
    });

    it('null일 경우 에러를 발생시킨다', () => {
      expect(() => ParseUtil.date(null)).toThrow('date is required');
    });

    it('undefined일 경우 에러를 발생시킨다', () => {
      expect(() => ParseUtil.date(undefined)).toThrow('date is required');
    });

    it('유효하지 않은 문자열일 경우 Date 객체를 생성한다 (new Date의 동작)', () => {
      // new Date('invalid')는 Invalid Date를 반환하지만, 여전히 Date 객체임
      const result = ParseUtil.date('invalid-date-string');
      expect(result).toBeInstanceOf(Date);
      // Invalid Date인지 확인
      expect(isNaN(result.getTime())).toBe(true);
    });

    it('빈 문자열일 경우 Date 객체를 생성한다', () => {
      const result = ParseUtil.date('');
      expect(result).toBeInstanceOf(Date);
    });

    it('다양한 날짜 형식 문자열을 처리한다', () => {
      const formats = ['2024-01-15', '2024/01/15', '01/15/2024', '2024-01-15T10:30:00Z'];

      formats.forEach((format) => {
        const result = ParseUtil.date(format);
        expect(result).toBeInstanceOf(Date);
      });
    });
  });
});
