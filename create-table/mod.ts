import {
  difference,
  format,
} from "https://deno.land/std@0.177.0/datetime/mod.ts";

type Datetimes = {
  firstCommittedAt: Date | null,
  createdAt: Date | null,
  createDuration: string,
  firstReviewSubmittedAt: Date | null,
  firstReviewDuration: string,
  approveReviewSubmittedAt: Date | null,
  approveDuration: string,
  closedAt: Date | null,
  closeDuration: string
}

function round(value: number, digits = 2) {
  const base = 10 * digits
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
    closeDuration
  }: Datetimes
) {
  return `${
    closedAt && firstCommittedAt
      ? `Lead time for changes ${round((difference(firstCommittedAt, closedAt).minutes ?? 0) / 60)}h\n`
      : ""
  }| index | datetime | duration |\n| ----- | -------- | -------- |\n${
    firstCommittedAt
      ? `| First commit | ${
        format(firstCommittedAt, datetimeFormat)
      } | - |\n`
      : ""
  }${
    createdAt
      ? `| PR opened | ${
        format(createdAt, datetimeFormat)
      } | ${createDuration} |\n`
      : ""
  }${
    firstReviewSubmittedAt
      ? `| PR first review | ${
        format(firstReviewSubmittedAt, datetimeFormat)
      } | ${firstReviewDuration} |\n`
      : ""
  }${
    approveReviewSubmittedAt
      ? `| PR approved | ${
        format(approveReviewSubmittedAt, datetimeFormat)
      } | ${approveDuration} |\n`
      : ""
  }${
    closedAt
      ? `| PR closed | ${format(closedAt, datetimeFormat)} | ${closeDuration} |\n`
      : ""
  }`
  // ${firstCommit ? `First Reviewer:\t${firstCommit?.authors[0].name}` : ""}`;
}

export {createTable}
