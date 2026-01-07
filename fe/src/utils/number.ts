const NumberUtil = {
  // 1534 -> "1.5k"
  formatCompact(value: number): string {
    const units = [
      { threshold: 1000000, suffix: 'M' },
      { threshold: 1000, suffix: 'k' },
    ];

    const absValue = Math.abs(value);
    const unit = units.find(({ threshold }) => absValue >= threshold);
    if (unit) {
      const sign = value < 0 ? '-' : '';
      return `${sign}${(absValue / unit.threshold).toFixed(1)}${unit.suffix}`;
    }
    return value.toString();
  },

  // 1534 -> "1,534"
  formatThousands(value: number): string {
    return value.toLocaleString();
  },
};

export default NumberUtil;
