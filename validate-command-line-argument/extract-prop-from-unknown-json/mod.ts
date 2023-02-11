import {
  isObject,
  isString,
} from "https://deno.land/x/documentaly/utilities/type-guard.ts";

const extractPropFromUnknownJson = <T>(
  json: unknown,
  propName: string,
  nallowing: (x: unknown) => x is T,
): T | null => {
  if (!isString(json)) {
    return null;
  }
  const jsonObject = JSON.parse(json);

  if (
    !isObject(jsonObject) || !(propName in jsonObject) ||
    !nallowing(jsonObject[propName])
  ) {
    return null;
  }

  return jsonObject[propName] as T;
};

export {extractPropFromUnknownJson}
