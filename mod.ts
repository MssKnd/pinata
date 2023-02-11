import { parse } from "https://deno.land/std@0.177.0/flags/mod.ts";
import { extractFirstAndApproveReview } from "./extruct-approved-at/mod.ts";
import { extractFirstCommit } from "./extruct-first-commit/mod.ts";
import { validateCommandLineArgument } from "./validate-command-line-argument/mod.ts";

function commandLineArgument() {
  return validateCommandLineArgument(parse(Deno.args, {
    alias: {
      b: "body",
      c: "commits",
      a: "createdAt",
      z: "closedAt",
      r: "reviews",
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

const firstCommit = extractFirstCommit(commits);
const {
  firstReview,
  approveReview,
} = extractFirstAndApproveReview(reviews);

const createDuration = createdAt && firstCommit
  ? `${createdAt?.getTime() - firstCommit.committedDate.getTime()}h`
  : "-";
const firstReviewDuration = firstReview && firstCommit
  ? `${
    firstReview.submittedAt.getTime() - firstCommit.committedDate.getTime()
  }h`
  : "-";
const approveDuration = approveReview && (firstReview || firstCommit)
  ? `${
    approveReview.submittedAt.getTime() -
    (firstReview.submittedAt ?? firstCommit?.committedDate).getTime()
  }h`
  : "-";
const closeDuration = closedAt && (approveReview || firstReview || firstCommit)
  ? `${
    closedAt.getTime() -
    (approveReview?.submittedAt ?? firstReview?.submittedAt ??
      firstCommit?.committedDate)!.getTime()
  }h`
  : "-";

const resultBody =
  `| index | datetime | duration |\n| ----- | -------- | -------- |
${
    firstCommit
      ? `| First commit | ${firstCommit?.committedDate.toISOString()} | - |`
      : ""
  }
${
    createdAt
      ? `| PR opened | ${createdAt?.toISOString()} | ${createDuration} |`
      : ""
  }
${
    firstReview
      ? `| PR first review | ${firstReview.submittedAt.toISOString()} | ${firstReviewDuration} |`
      : ""
  }
${
    approveReview
      ? `| PR approved | ${approveReview.submittedAt.toISOString()} | ${approveDuration} |`
      : ""
  }
${
    closedAt
      ? `| PR closed | ${closedAt?.toISOString()} | ${closeDuration} |`
      : ""
  }${firstCommit ? `First Reviewer:\t${firstCommit?.authors[0].name}` : ""}`;

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
