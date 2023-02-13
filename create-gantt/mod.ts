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

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const axisFormat = "%H:%M";

function createGantt(
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
  return `\`\`\`mermaid
gantt
  ${
    closedAt && firstCommittedAt
      ? `title Lead time for changes ${
        round((difference(firstCommittedAt, closedAt).minutes ?? 0) / 60)
      }h\n`
      : ""
  }  dateFormat ${dateFormat}
  axisFormat ${axisFormat}
  excludes weekends
  ${
    firstCommittedAt
      ? `\n  ${round((createDuration?.minutes ?? 0) / 60)} h     :a1, ${
        format(firstCommittedAt, dateFormat)
      }, ${createDuration?.seconds}s`
      : ""
  }${
    createdAt
      ? `\n  ${
        round((firstReviewDuration?.minutes ?? 0) / 60)
      } h     :a2, after a1, ${firstReviewDuration?.seconds}s`
      : ""
  }${
    firstReviewSubmittedAt
      ? `\n  ${
        round((approveDuration?.minutes ?? 0) / 60)
      } h     :a3, after a2, ${approveDuration?.seconds}s`
      : ""
  }${
    approveReviewSubmittedAt
      ? `\n  ${
        round((closeDuration?.minutes ?? 0) / 60)
      } h     :a4, after a3, ${closeDuration?.seconds}s`
      : ""
  }${
    firstCommittedAt
      ? `\n  First Commit : milestone, m1, ${
        format(firstCommittedAt, dateFormat)
      },`
      : ""
  }${
    createdAt
      ? `\n  PR Open : milestone, m2, ${format(createdAt, dateFormat)},`
      : ""
  }${
    firstReviewSubmittedAt
      ? `\n  First Review : milestone, m3, ${
        format(firstReviewSubmittedAt, dateFormat)
      },`
      : ""
  }${
    approveReviewSubmittedAt
      ? `\n  PR Approve : milestone, m4, ${
        format(approveReviewSubmittedAt, dateFormat)
      },`
      : ""
  }${
    closedAt
      ? `\n  PR Close: milestone, m4, ${format(closedAt, dateFormat)},`
      : ""
  }
\`\`\``;
}

export { createGantt };
