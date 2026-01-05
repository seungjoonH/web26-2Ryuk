import { describe, it, expect } from 'vitest';
import NumberUtil from './number';

describe('NumberUtil', () => {
  describe('formatCompact', () => {
    it('1000 미만의 숫자는 그대로 문자열로 반환한다', () => {
      expect(NumberUtil.formatCompact(0)).toBe('0');
      expect(NumberUtil.formatCompact(1)).toBe('1');
      expect(NumberUtil.formatCompact(99)).toBe('99');
      expect(NumberUtil.formatCompact(999)).toBe('999');
    });

    it('1000 이상 1000000 미만의 숫자는 k 접미사를 붙인다', () => {
      expect(NumberUtil.formatCompact(1000)).toBe('1.0k');
      expect(NumberUtil.formatCompact(1534)).toBe('1.5k');
      expect(NumberUtil.formatCompact(9999)).toBe('10.0k');
      expect(NumberUtil.formatCompact(12345)).toBe('12.3k');
      expect(NumberUtil.formatCompact(999999)).toBe('1000.0k');
    });

    it('1000000 이상의 숫자는 M 접미사를 붙인다', () => {
      expect(NumberUtil.formatCompact(1000000)).toBe('1.0M');
      expect(NumberUtil.formatCompact(1500000)).toBe('1.5M');
      expect(NumberUtil.formatCompact(12345678)).toBe('12.3M');
      expect(NumberUtil.formatCompact(999999999)).toBe('1000.0M');
    });

    it('소수점 첫째 자리까지 표시한다', () => {
      expect(NumberUtil.formatCompact(1500)).toBe('1.5k');
      expect(NumberUtil.formatCompact(1550)).toBe('1.6k');
      expect(NumberUtil.formatCompact(1500000)).toBe('1.5M');
    });

    it('음수 1000 이상 1000000 미만은 -k 접미사를 붙인다', () => {
      expect(NumberUtil.formatCompact(-1000)).toBe('-1.0k');
      expect(NumberUtil.formatCompact(-1500)).toBe('-1.5k');
      expect(NumberUtil.formatCompact(-999999)).toBe('-1000.0k');
    });

    it('음수 1000000 이상은 -M 접미사를 붙인다', () => {
      expect(NumberUtil.formatCompact(-1000000)).toBe('-1.0M');
      expect(NumberUtil.formatCompact(-1500000)).toBe('-1.5M');
    });

    it('경계값을 올바르게 처리한다', () => {
      expect(NumberUtil.formatCompact(999)).toBe('999');
      expect(NumberUtil.formatCompact(1000)).toBe('1.0k');
      expect(NumberUtil.formatCompact(999999)).toBe('1000.0k');
      expect(NumberUtil.formatCompact(1000000)).toBe('1.0M');
    });
  });

  describe('formatThousands', () => {
    it('천 단위 구분자로 숫자를 포맷팅한다', () => {
      expect(NumberUtil.formatThousands(1000)).toBe('1,000');
      expect(NumberUtil.formatThousands(1534)).toBe('1,534');
      expect(NumberUtil.formatThousands(12345)).toBe('12,345');
      expect(NumberUtil.formatThousands(123456)).toBe('123,456');
      expect(NumberUtil.formatThousands(1234567)).toBe('1,234,567');
    });

    it('1000 미만의 숫자도 올바르게 처리한다', () => {
      expect(NumberUtil.formatThousands(0)).toBe('0');
      expect(NumberUtil.formatThousands(1)).toBe('1');
      expect(NumberUtil.formatThousands(99)).toBe('99');
      expect(NumberUtil.formatThousands(999)).toBe('999');
    });

    it('음수도 올바르게 처리한다', () => {
      expect(NumberUtil.formatThousands(-1000)).toBe('-1,000');
      expect(NumberUtil.formatThousands(-12345)).toBe('-12,345');
    });

    it('소수점이 있는 숫자도 올바르게 처리한다', () => {
      expect(NumberUtil.formatThousands(1234.56)).toBe('1,234.56');
      expect(NumberUtil.formatThousands(1234567.89)).toBe('1,234,567.89');
    });

    it('큰 숫자도 올바르게 처리한다', () => {
      expect(NumberUtil.formatThousands(1000000000)).toBe('1,000,000,000');
      expect(NumberUtil.formatThousands(999999999999)).toBe('999,999,999,999');
    });
  });
});
