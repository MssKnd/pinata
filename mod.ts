import {
  difference,
} from "https://deno.land/std@0.177.0/datetime/mod.ts";
import { commandLineArgument } from "./command-line-argument/mod.ts";
import { createTable } from "./create-table/mod.ts";
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

const resultBody = createTable(datetimeFormat, {
  firstCommittedAt: firstCommit?.committedDate ?? null,
  createdAt,
  createDuration,
  firstReviewSubmittedAt: firstReview?.submittedAt ?? null,
  firstReviewDuration,
  approveReviewSubmittedAt: approveReview?.submittedAt ?? null,
  approveDuration,
  closedAt,
  closeDuration
})

const commentWrapdBody =
  `<!-- pinata: start -->\n${resultBody}\n<!-- pinata: end -->`;

const regExp = /<!--\s*pinata:\s*start\s*-->(.*?)<!--\s*pinata:\s*end\s*-->/gms;

if (body?.match(regExp)) {
  const replacedBody = body?.replace(regExp, (_, __) => commentWrapdBody);
  console.log(`${replacedBody}`);
} else {
  console.log(`${body}\n${commentWrapdBody}`);
}
