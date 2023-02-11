import { isObject, isString } from "../deps.ts";

function extractFirstCommit(commits: unknown[]) {
  const [firstCommit] = commits;
  if (!firstCommit || !isObject(firstCommit)) {
    return null;
  }
  if (
    !("committedDate" in firstCommit) || !isString(firstCommit.committedDate) ||
    !("authors" in firstCommit) || !Array.isArray(firstCommit.authors)
  ) {
    return null;
  }
  return {
    committedDate: new Date(firstCommit.committedDate),
    authors: firstCommit.authors,
  };
}

export { extractFirstCommit };
