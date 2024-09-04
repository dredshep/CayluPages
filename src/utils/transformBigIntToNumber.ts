// src/utils/transformBigIntToNumber.ts

import Decimal from "decimal.js";

type BasicValue = string | number | boolean | null;
type TransformableValue =
  | BasicValue
  | BigIntToNumberObject
  | BigIntToNumberArray;

interface BigIntToNumberObject {
  [key: string]: TransformableValue;
}

interface BigIntToNumberArray extends Array<TransformableValue> {}

export function transformBigIntToNumber<T extends TransformableValue>(
  item: T
): T {
  if (Array.isArray(item)) {
    return item.map(transformBigIntToNumber) as T;
  } else if (
    item &&
    typeof item === "object" &&
    !(item instanceof Date) &&
    !(item instanceof Decimal)
  ) {
    const result: { [key: string]: TransformableValue } = {};
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === "bigint") {
        result[key] = Number(value);
      } else {
        result[key] = transformBigIntToNumber(value);
      }
    }
    return result as T;
  } else if (item instanceof Decimal) {
    return item.toNumber() as T;
  } else if (item instanceof Date) {
    return item.toISOString() as T;
  }
  return item;
}
