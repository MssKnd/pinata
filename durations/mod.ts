import { difference } from "../deps.ts";

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
    !firstReviewSubmittedAt && approveReviewSubmittedAt
      ? undefined
      : difference(createdAt, firstReviewSubmittedAt ?? closedAt ?? current);
  const approveOrCloseDuration = firstReviewSubmittedAt
    ? difference(
      firstReviewSubmittedAt,
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
    approveOrCloseDuration,
    closeDuration,
  };
}

export { durations };
