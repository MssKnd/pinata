import { parse } from "https://deno.land/std@0.220.1/flags/mod.ts";
import { validateCommandLineArgument } from "../validate-command-line-argument/mod.ts";

function commandLineArgument() {
  return validateCommandLineArgument(parse(Deno.args, {
    alias: {
      b: "body",
      c: "commits",
      a: "createdAt",
      z: "closedAt",
      r: "reviews",
      d: "datetimeFormat",
    },
  }));
}

export { commandLineArgument };
