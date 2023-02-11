import { parse } from "https://deno.land/std@0.177.0/flags/mod.ts";
import { isObject, isString } from "https://deno.land/x/documentaly/utilities/type-guard.ts";
import { validateCommandLineArgument } from "./validate-command-line-argument/mod.ts";

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

const {
  commits,
  createdAt,
  closedAt,
  body,
  reviews,
} = commandLineArgument();

function extractFirstCommit(commits: unknown[]) {
  const [firstCommit] = commits;
  if (!firstCommit || !isObject(firstCommit)) {
    return null
  }
  if (
    !('committedDate' in firstCommit) || !isString(firstCommit.committedDate) ||
    !('authors' in firstCommit) || !Array.isArray(firstCommit.authors)
  ) {
    return null
  }
  return {
    committedDate: new Date(firstCommit.committedDate),
    authors: firstCommit.authors,
  }
}


const firstCommit = extractFirstCommit(commits)

const createDuration = firstCommit && createdAt ? `${firstCommit.committedDate.getTime() - createdAt?.getTime()}h` : null;
// const approvedDuration = `h`;
const closedDuration = `h`;


const resultBody = `| index | datetime | duration |\n| ----- | -------- | -------- |
${firstCommit ? `| First commit | ${firstCommit?.committedDate.toISOString()} | - |` : ""}
${createdAt ? `| PR opened | ${createdAt?.toISOString()} | ${createDuration} |` : ""}
${closedAt ? `| PR Closed | ${closedAt?.toISOString()} | ${closedDuration} |` : ""}
${firstCommit ? `First Reviewer:\t${firstCommit?.authors[0].name}` : ""}`;
// | Approved     | ${
//   new Date(firstCommittedDate).toISOString()
// } | ${approvedDuration}    |

console.log({
  firstCommittedAt: firstCommit?.committedDate,
  createdAt,
  closedAt,
  createDuration,
  resultBody,
});

const commentWrapdBody =
  `<!-- pinata: start -->\n${resultBody}\n<!-- pinata: end -->`;

const regExp = /<!--\s*pinata:\s*start\s*-->(.*?)<!--\s*pinata:\s*end\s*-->/gms;

if (body?.match(regExp)) {
  const replacedBody = body?.replace(
    /<!--\s*pinata:\s*start\s*-->(.*?)<!--\s*pinata:\s*end\s*-->/gms,
    (_, __) => commentWrapdBody,
  );
  console.log(`${replacedBody}`);
} else {
  console.log(`${body}\n${commentWrapdBody}`);
}
