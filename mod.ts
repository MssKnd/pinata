import { format } from "https://deno.land/std@0.177.0/datetime/mod.ts";
import { commandLineArgument } from "./command-line-argument/mod.ts";
import { extractFirstAndApproveReview } from "./extruct-approved-at/mod.ts";
import { extractFirstCommit } from "./extruct-first-commit/mod.ts";

const {
  commits,
  createdAt,
  closedAt,
  body,
  reviews,
  datetimeFormat,
} = commandLineArgument();

const firstCommit = extractFirstCommit(commits);
const {
  firstReview,
  approveReview,
} = extractFirstAndApproveReview(reviews);

const createDuration = createdAt && firstCommit
  ? `${(createdAt?.getTime() - firstCommit.committedDate.getTime()) / 1000}s`
  : "-";
const firstReviewDuration = firstReview && firstCommit
  ? `${
    (firstReview.submittedAt.getTime() - firstCommit.committedDate.getTime()) /
    1000
  }s`
  : "-";
const approveDuration = approveReview && (firstReview || firstCommit)
  ? `${
    approveReview.submittedAt.getTime() -
    ((firstReview.submittedAt ?? firstCommit?.committedDate).getTime()) / 1000
  }s`
  : "-";
const closeDuration = closedAt && (approveReview || firstReview || firstCommit)
  ? `${
    closedAt.getTime() -
    ((approveReview?.submittedAt ?? firstReview?.submittedAt ??
        firstCommit?.committedDate)!.getTime()) / 1000
  }s`
  : "-";
console.log(datetimeFormat);
const resultBody =
  `| index | datetime | duration |\n| ----- | -------- | -------- |
${
    firstCommit
      ? `| First commit | ${
        format(firstCommit.committedDate, datetimeFormat)
      } | - |`
      : ""
  }
${
    createdAt
      ? `| PR opened | ${
        format(createdAt, datetimeFormat)
      } | ${createDuration} |`
      : ""
  }
${
    firstReview
      ? `| PR first review | ${
        format(firstReview.submittedAt, datetimeFormat)
      } | ${firstReviewDuration} |`
      : ""
  }
${
    approveReview
      ? `| PR approved | ${
        format(approveReview.submittedAt, datetimeFormat)
      } | ${approveDuration} |`
      : ""
  }
${
    closedAt
      ? `| PR closed | ${format(closedAt, datetimeFormat)} | ${closeDuration} |`
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
