import { isObject, isString } from "../deps.ts";

type Review = {
  submittedAt: Date;
  state: string; // APPROVED | xxxxx
};

function validateReview(input: unknown): Review {
  if (
    !isObject(input) || !("submittedAt" in input) ||
    !isString(input.submittedAt) || !("state" in input) ||
    !isString(input.state)
  ) {
    throw Error("invalid review");
  }
  return {
    submittedAt: new Date(input.submittedAt),
    state: input.state,
  };
}

function isApproveReview(review: Review) {
  return review.state === "APPROVED";
}

function extractFirstAndApproveReview(inputs: unknown[]) {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    return {
      firstReview: undefined,
      approveReview: undefined,
    };
  }
  const reviews = inputs.map(validateReview);
  const approveReviews = reviews.filter(isApproveReview);
  const [firstApproveReview] = approveReviews;
  return {
    firstReview: reviews[0],
    approveReview: firstApproveReview ?? undefined,
  };
}

export { extractFirstAndApproveReview };
