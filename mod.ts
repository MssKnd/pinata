import {
  difference,
  format,
} from "https://deno.land/std@0.177.0/datetime/mod.ts";
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
  ? `${difference(firstCommit.committedDate, createdAt).minutes}m`
  : "-";
const firstReviewDuration = firstReview && firstCommit
  ? `${difference(firstCommit.committedDate, firstReview.submittedAt).minutes}m`
  : "-";
const approveDuration = approveReview && (firstReview || firstCommit)
  ? `${
    difference(
      firstReview?.submittedAt ?? firstCommit!.committedDate,
      approveReview.submittedAt,
    ).minutes
  }m`
  : "-";
const closeDuration = closedAt && (approveReview || firstReview || firstCommit)
  ? `${
    difference(
      approveReview?.submittedAt ?? firstReview?.submittedAt ??
        firstCommit!.committedDate,
      closedAt,
    ).minutes
  }m`
  : "-";
const resultBody = `${
  closedAt && firstCommit
    ? `Lead time for changes ${
      (difference(firstCommit.committedDate, closedAt).minutes ?? 0) / 60
    }h\n`
    : ""
}| index | datetime | duration |\n| ----- | -------- | -------- |\n${
  firstCommit
    ? `| First commit | ${
      format(firstCommit.committedDate, datetimeFormat)
    } | - |\n`
    : ""
}${
  createdAt
    ? `| PR opened | ${
      format(createdAt, datetimeFormat)
    } | ${createDuration} |\n`
    : ""
}${
  firstReview
    ? `| PR first review | ${
      format(firstReview.submittedAt, datetimeFormat)
    } | ${firstReviewDuration} |\n`
    : ""
}${
  approveReview
    ? `| PR approved | ${
      format(approveReview.submittedAt, datetimeFormat)
    } | ${approveDuration} |\n`
    : ""
}${
  closedAt
    ? `| PR closed | ${format(closedAt, datetimeFormat)} | ${closeDuration} |\n`
    : ""
}
${firstCommit ? `First Reviewer:\t${firstCommit?.authors[0].name}` : ""}`;

const commentWrapdBody =
  `<!-- pinata: start -->\n${resultBody}\n<!-- pinata: end -->`;

const regExp = /<!--\s*pinata:\s*start\s*-->(.*?)<!--\s*pinata:\s*end\s*-->/gms;

if (body?.match(regExp)) {
  const replacedBody = body?.replace(regExp, (_, __) => commentWrapdBody);
  console.log(`${replacedBody}`);
} else {
  console.log(`${body}\n${commentWrapdBody}`);
}
