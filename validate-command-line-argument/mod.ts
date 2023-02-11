import { isObject, isString } from "../deps.ts";
import { extractPropFromUnknownJson } from "./extract-prop-from-unknown-json/mod.ts";

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

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
  const reviews = "reviews" in input
    ? extractPropFromUnknownJson(input.reviews, "reviews", Array.isArray) ?? []
    : [];

  return {
    body,
    commits,
    createdAt: isValidDate(new Date(createdAt)) ? new Date(createdAt) : null,
    closedAt: isValidDate(new Date(closedAt)) ? new Date(closedAt) : null,
    reviews,
  };
}

export { validateCommandLineArgument };
