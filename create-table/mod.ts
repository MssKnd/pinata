import {
  difference,
  format,
  Unit,
} from "https://deno.land/std@0.177.0/datetime/mod.ts";

type Datetimes = {
  firstCommittedAt: Date | null;
  createdAt: Date | null;
  createDuration: Partial<Record<Unit, number>> | null;
  firstReviewSubmittedAt: Date | null;
  firstReviewDuration: Partial<Record<Unit, number>> | null;
  approveReviewSubmittedAt: Date | null;
  approveDuration: Partial<Record<Unit, number>> | null;
  closedAt: Date | null;
  closeDuration: Partial<Record<Unit, number>> | null;
};

function round(value: number, digits = 2) {
  const base = 10 * digits;
  return Math.round(value * base) / base;
}

function createTable(
  datetimeFormat: string,
  {
    firstCommittedAt,
    createdAt,
    createDuration,
    firstReviewSubmittedAt,
    firstReviewDuration,
    approveReviewSubmittedAt,
    approveDuration,
    closedAt,
    closeDuration,
  }: Datetimes,
) {
  return `${
    closedAt && firstCommittedAt
      ? `Lead time for changes ${
        round((difference(firstCommittedAt, closedAt).minutes ?? 0) / 60)
      }h\n`
      : ""
  }| index | datetime | duration |\n| ----- | -------- | -------- |\n${
    firstCommittedAt
      ? `| First commit | ${format(firstCommittedAt, datetimeFormat)} | - |\n`
      : ""
  }${
    createdAt
      ? `| PR opened | ${
        format(createdAt, datetimeFormat)
      } | ${createDuration?.minutes}m |\n`
      : ""
  }${
    firstReviewSubmittedAt
      ? `| PR first review | ${
        format(firstReviewSubmittedAt, datetimeFormat)
      } | ${firstReviewDuration?.minutes}m |\n`
      : ""
  }${
    approveReviewSubmittedAt
      ? `| PR approved | ${
        format(approveReviewSubmittedAt, datetimeFormat)
      } | ${approveDuration?.minutes}m |\n`
      : ""
  }${
    closedAt
      ? `| PR closed | ${
        format(closedAt, datetimeFormat)
      } | ${closeDuration?.minutes}m |\n`
      : ""
  }`;
  // ${firstCommit ? `First Reviewer:\t${firstCommit?.authors[0].name}` : ""}`;
}

export { createTable };
