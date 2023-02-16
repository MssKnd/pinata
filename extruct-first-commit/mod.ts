import { isObject, isString } from "../deps.ts";

function extractFirstCommit(commits: unknown[]) {
  const [firstCommit] = commits;
  if (!firstCommit || !isObject(firstCommit)) {
    throw new Error("First commit is undefined");
  }
  if (
    !("committedDate" in firstCommit) || !isString(firstCommit.committedDate) ||
    !("authors" in firstCommit) || !Array.isArray(firstCommit.authors)
  ) {
    throw new Error("First commit is invalid");
  }
  return {
    committedDate: new Date(firstCommit.committedDate),
    authors: firstCommit.authors,
  };
}

export { extractFirstCommit };
