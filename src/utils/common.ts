export const pick = <T extends object, K extends keyof T>(
  obj: T,
  ...propNames: K[]
): Partial<Pick<T, K>> => {
  if (!obj || !propNames) {
    return {};
  }

  return Object.keys(obj).reduce(
    (acc, key) => {
      if (propNames.includes(key as K)) {
        acc[key as K] = obj[key as K];
      }
      return acc;
    },
    {} as Partial<Pick<T, K>>
  );
};

export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null;

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = -1;
      fn(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, wait);
  };
};

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number';

export const parseJSON = <T = unknown>(value: string): T | null => {
  if (!value) {
    return null;
  }

  const result = JSON.parse(value);
  return typeof result === 'string' ? JSON.parse(result) : result;
};
