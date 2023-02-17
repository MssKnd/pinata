import { difference, format, Unit } from "../deps.ts";

type CreateGanttProps = {
  firstCommittedAt: Date;
  createdAt: Date;
  createDuration: Partial<Record<Unit, number>>;
  firstReviewSubmittedAt?: Date;
  firstReviewOrCloseDuration?: Partial<Record<Unit, number>>;
  approveReviewSubmittedAt?: Date;
  approveDuration?: Partial<Record<Unit, number>>;
  closedAt?: Date;
  closeDuration?: Partial<Record<Unit, number>>;
};

function round(value: number, digits = 2) {
  const base = 10 * digits;
  return Math.round(value * base) / base;
}

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const axisFormat = "%a %H:%M";

function createGantt(
  {
    firstCommittedAt,
    createdAt,
    createDuration,
    firstReviewSubmittedAt,
    firstReviewOrCloseDuration,
    approveReviewSubmittedAt,
    approveDuration,
    closedAt,
    closeDuration,
  }: CreateGanttProps,
) {
  return `\`\`\`mermaid
gantt
  ${
    closedAt && firstCommittedAt
      ? `title Lead time for changes ${
        round((difference(firstCommittedAt, closedAt).minutes ?? 0) / 60)
      } h\n`
      : ""
  }dateFormat ${dateFormat}
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
        round((firstReviewOrCloseDuration?.minutes ?? 0) / 60)
      } h     :a2, after a1, ${firstReviewOrCloseDuration?.seconds}s`
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
