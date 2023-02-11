import { parse } from "https://deno.land/std@0.177.0/flags/mod.ts";
import {
  isObject,
  isString,
} from "https://deno.land/x/documentaly/utilities/type-guard.ts";

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

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

function validateCommandLineArgument(input: unknown) {
  if (
    !isObject(input) || !("_" in input) || !Array.isArray(input._)
  ) {
    throw new Error("invalid argument");
  }

  const body = "body" in input
    ? extractPropFromUnknownJson(input.body, "body", isString) ?? ""
    : "";
  const commits = "commits" in input
    ? extractPropFromUnknownJson(input.commits, "commits", Array.isArray) ?? []
    : [];
  const createdAt = "createdAt" in input
    ? extractPropFromUnknownJson(input.createdAt, "createdAt", isString) ?? ""
    : "";
  const closedAt = "closedAt" in input
    ? extractPropFromUnknownJson(input.closedAt, "closedAt", isString) ?? ""
    : "";

  return {
    body,
    commits,
    createdAt: isValidDate(new Date(createdAt)) ? new Date(createdAt) : null,
    closedAt: isValidDate(new Date(closedAt)) ? new Date(closedAt) : null,
  };
}

function commandLineArgument() {
  return validateCommandLineArgument(parse(Deno.args, {
    alias: {
      b: "body",
      c: "commits",
      a: "createdAt",
      z: "closedAt",
    },
  }));
}

const obj = commandLineArgument();

console.log(obj.commits[0]);

const firstCommitDuration = `h`;
const approvedDuration = `h`;
const closedDuration = `h`;

const resultBody = `
| index           | datetime                                                | duration               |
| --------------- | ------------------------------------------------------- | ---------------------- |
| PR Opened At:   | ${obj.closedAt?.toISOString()}                          | -                      |
| First Commit At | ${
  new Date(obj.commits[0].committedDate).toISOString()
} | ${firstCommitDuration} |
| Approved At     | ${
  new Date(obj.commits[0].committedDate).toISOString()
} | ${approvedDuration}    |
| PR Closed At    | ${obj.closedAt?.toISOString()}                          | ${closedDuration}      |

First Reviewer:\t${obj.commits[0].authors[0].name}
`;

const commentWrapdBody =
  `<!-- pinata: start -->\n${resultBody}\n<!-- pinata: end -->`;

const regExp = /<!--\s*pinata:\s*start\s*-->(.*?)<!--\s*pinata:\s*end\s*-->/gms;

if (obj.body?.match(regExp)) {
  const replacedBody = obj.body?.replace(
    /<!--\s*pinata:\s*start\s*-->(.*?)<!--\s*pinata:\s*end\s*-->/gms,
    (_, __) => commentWrapdBody,
  );
  console.log(`${replacedBody}`);
} else {
  console.log(`${obj.body}\n${commentWrapdBody}`);
}
