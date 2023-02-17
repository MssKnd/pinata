import {
  difference,
  format,
  Unit,
} from "https://deno.land/std@0.177.0/datetime/mod.ts";

type Datetimes = {
  firstCommittedAt: Date;
  createdAt: Date;
  createDuration: Partial<Record<Unit, number>>;
  firstReviewSubmittedAt?: Date;
  firstReviewOrCloseDuration?: Partial<Record<Unit, number>>;
  approveReviewSubmittedAt?: Date;
  approveOrCloseDuration?: Partial<Record<Unit, number>>;
  closedAt?: Date;
  closeDuration?: Partial<Record<Unit, number>>;
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
    firstReviewOrCloseDuration,
    approveReviewSubmittedAt,
    approveOrCloseDuration,
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
      } | ${firstReviewOrCloseDuration?.minutes}m |\n`
      : ""
  }${
    approveReviewSubmittedAt
      ? `| PR approved | ${
        format(approveReviewSubmittedAt, datetimeFormat)
      } | ${approveOrCloseDuration?.minutes}m |\n`
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
