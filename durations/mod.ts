import { difference } from "https://deno.land/std@0.177.0/datetime/mod.ts";

type DurationProps = {
  createdAt: Date;
  firstCommittedAt: Date;
  firstReviewSubmittedAt?: Date;
  approveReviewSubmittedAt?: Date;
  closedAt?: Date;
};

function durations(
  {
    createdAt,
    firstCommittedAt,
    firstReviewSubmittedAt,
    approveReviewSubmittedAt,
    closedAt,
  }: DurationProps,
) {
  const current = new Date();
  const createDuration = difference(firstCommittedAt, createdAt);
  const firstReviewOrCloseDuration =
    firstReviewSubmittedAt || closedAt || approveReviewSubmittedAt
      ? difference(createdAt, firstReviewSubmittedAt ?? closedAt ?? current)
      : undefined;
  const approveDuration = (approveReviewSubmittedAt || closedAt) &&
      firstReviewSubmittedAt
    ? difference(
      firstReviewSubmittedAt ?? createdAt!,
      approveReviewSubmittedAt ?? current,
    )
    : undefined;
  const closeDuration = closedAt
    ? difference(
      approveReviewSubmittedAt ?? firstReviewSubmittedAt ?? createdAt,
      closedAt,
    )
    : undefined;

  return {
    createDuration,
    firstReviewOrCloseDuration,
    approveDuration,
    closeDuration,
  };
}

export { durations };
