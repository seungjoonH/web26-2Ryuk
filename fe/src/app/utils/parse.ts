import IS from './is';

const ParseUtil = {
  date: (date?: string | Date | null): Date => {
    if (IS.nil(date)) throw new Error('date is required');
    if (IS.date(date)) return date as Date;
    if (IS.string(date)) return new Date(date as string);
    throw new Error('date is invalid');
  },
};

export default ParseUtil;
