import { commandLineArgument } from "./command-line-argument/mod.ts";
import { createGantt } from "./create-gantt/mod.ts";
import { createTable } from "./create-table/mod.ts";
import { durations } from "./durations/mod.ts";
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

const {
  createDuration,
  firstReviewOrCloseDuration,
  approveDuration,
  closeDuration,
} = durations({
  createdAt,
  firstCommittedAt: firstCommit?.committedDate,
  firstReviewSubmittedAt: firstReview?.submittedAt,
  approveReviewSubmittedAt: approveReview?.submittedAt,
  closedAt,
});

const gantt = createGantt(datetimeFormat, {
  firstCommittedAt: firstCommit?.committedDate,
  createdAt,
  createDuration,
  firstReviewSubmittedAt: firstReview?.submittedAt,
  firstReviewOrCloseDuration,
  approveReviewSubmittedAt: approveReview?.submittedAt,
  approveDuration,
  closedAt,
  closeDuration,
});

const table = createTable(datetimeFormat, {
  firstCommittedAt: firstCommit?.committedDate,
  createdAt,
  createDuration,
  firstReviewSubmittedAt: firstReview?.submittedAt,
  firstReviewOrCloseDuration,
  approveReviewSubmittedAt: approveReview?.submittedAt,
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
