import { difference } from "https://deno.land/std@0.177.0/datetime/mod.ts";
import { commandLineArgument } from "./command-line-argument/mod.ts";
import { createGantt } from "./create-gantt/mod.ts";
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

const current = new Date();
const createDuration = createdAt && firstCommit
  ? difference(firstCommit.committedDate, createdAt)
  : null;
const firstReviewDuration = (firstReview || !closedAt || !approveReview) && createdAt
  ? difference(createdAt, firstReview?.submittedAt ?? current)
  : null;
const approveDuration =
  (approveReview || !closedAt) && (firstReview || createdAt)
    ? difference(
      firstReview?.submittedAt ?? createdAt!,
      approveReview?.submittedAt ?? current,
    )
    : null;
const closeDuration = closedAt && (approveReview || firstReview || createdAt)
  ? difference(
    approveReview?.submittedAt ?? firstReview?.submittedAt ?? createdAt!,
    closedAt,
  )
  : null;

const gantt = createGantt(datetimeFormat, {
  firstCommittedAt: firstCommit?.committedDate ?? null,
  createdAt,
  createDuration,
  firstReviewSubmittedAt: firstReview?.submittedAt ?? null,
  firstReviewDuration,
  approveReviewSubmittedAt: approveReview?.submittedAt ?? null,
  approveDuration,
  closedAt,
  closeDuration,
});

const table = createTable(datetimeFormat, {
  firstCommittedAt: firstCommit?.committedDate ?? null,
  createdAt,
  createDuration,
  firstReviewSubmittedAt: firstReview?.submittedAt ?? null,
  firstReviewDuration,
  approveReviewSubmittedAt: approveReview?.submittedAt ?? null,
  approveDuration,
  closedAt,
  closeDuration,
});

const commentWrapdBody = `<!-- pinata: start -->

${gantt}

<details>
<summary>Details</summary>

${table}

</details>
<!-- pinata: end -->`;

const regExp = /<!--\s*pinata:\s*start\s*-->(.*?)<!--\s*pinata:\s*end\s*-->/gms;

if (body?.match(regExp)) {
  const replacedBody = body?.replace(regExp, (_, __) => commentWrapdBody);
  console.log(`${replacedBody}`);
} else {
  console.log(`${body}\n${commentWrapdBody}`);
}
