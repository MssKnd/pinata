import { parse } from "https://deno.land/std@0.177.0/flags/mod.ts";
import {
  isObject,
  isString,
} from "https://deno.land/x/documentaly/utilities/type-guard.ts";

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

function validateCommandLineArgument(input: unknown) {
  if (
    !isObject(input) || !("_" in input) || !Array.isArray(input._)
  ) {
    throw new Error("invalid argument");
  }

  return {
    body: "body" in input && isString(input.body) ? input.body : null,
    commits: "commits" in input && isString(input.commits)
      ? JSON.parse(input.commits)
      : [],
    createdAt: "createdAt" in input && isValidDate(new Date(input.createdAt))
      ? new Date(input.createdAt)
      : null,
    closedAt: "closedAt" in input && isValidDate(new Date(input.closedAt))
      ? new Date(input.closedAt)
      : null,
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

console.log(`${obj.body}\n${obj.createdAt}\n${obj.closedAt}\n${obj.commits}`);
