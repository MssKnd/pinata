import { isObject, isString } from "../deps.ts";
import { extractPropFromUnknownJson } from "./extract-prop-from-unknown-json/mod.ts";

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

function validateCommandLineArgument(input: unknown) {
  if (
    !isObject(input) || !("_" in input) || !Array.isArray(input._)
  ) {
    throw new Error("invalid argument");
  }

  if (!("createdAt" in input)) {
    throw new Error("-a (createdAt) argument is required");
  }
  const createdAtString =
    extractPropFromUnknownJson(input.createdAt, "createdAt", isString) ?? "";
  if (!isValidDate(new Date(createdAtString))) {
    throw new Error("-a (createdAt) argument is invalid date");
  }

  if (!("commits" in input)) {
    throw new Error("-c (commits) argument is required");
  }
  const commits =
    extractPropFromUnknownJson(input.commits, "commits", Array.isArray) ?? [];

  const body = "body" in input
    ? extractPropFromUnknownJson(input.body, "body", isString) ?? ""
    : "";
  const closedAt = "closedAt" in input
    ? extractPropFromUnknownJson(input.closedAt, "closedAt", isString) ?? ""
    : "";
  const reviews = "reviews" in input
    ? extractPropFromUnknownJson(input.reviews, "reviews", Array.isArray) ?? []
    : [];
  const datetimeFormat =
    "datetimeFormat" in input && isString(input.datetimeFormat)
      ? input.datetimeFormat
      : "MM-dd hh:mm";

  return {
    body,
    commits,
    createdAt: new Date(createdAtString),
    closedAt: isValidDate(new Date(closedAt)) ? new Date(closedAt) : undefined,
    reviews,
    datetimeFormat,
  };
}

export { validateCommandLineArgument };
