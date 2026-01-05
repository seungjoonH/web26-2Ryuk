export type ValueUnit = string | number;
export type CSSVarProperies = { [key: `--${string}`]: string };

/**
 * CSS 클래스명을 동적으로 생성하는 유틸리티 객체
 */
const CSSUtil = {
  /**
   * 여러 인자를 받아 공백으로 구분된 CSS 클래스명 문자열을 생성하는 함수
   * Falsy 값(false, null, undefined, 0, '')은 자동으로 필터링됨
   * @param args - CSS 클래스명으로 사용할 문자열, 숫자, 또는 조건부 표현식
   * @returns 공백으로 구분된 CSS 클래스명 문자열
   * @example
   * ```typescript
   * CSSUtil.buildCls("btn", "primary", isActive && "active")
   * // "btn primary active" 또는 "btn primary"
   * ```
   */
  buildCls: (...args: any[]): string => args.filter(Boolean).join(' ').trim(),
};

export default CSSUtil;
