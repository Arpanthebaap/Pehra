import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";

import { Findings } from "@/components/Findings";
import { ClockHero } from "@/components/ClockHero";
import { DeadlineList } from "@/components/DeadlineList";
import { Disclaimer } from "@/components/Disclaimer";
import { getStatute } from "@/lib/corpus/statutes";
import type { GroundedFinding } from "@/lib/schema";
import type { Deadline } from "@/lib/clock";

/**
 * Accessibility is asserted, not assumed.
 *
 * Pehra's users skew towards people reading in a second language, on small
 * screens, sometimes with a screen reader. Shipping a WCAG violation here is a
 * product failure, not a polish issue - so axe runs in CI against the real
 * components, and a violation fails the build.
 */
async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    // jsdom has no layout or canvas, so it cannot measure contrast. Saying so
    // is more honest than letting the rule pass vacuously; the palette is
    // checked against WCAG AA by hand and the ratios are recorded in README.
    rules: { "color-contrast": { enabled: false } },
  });
  const summary = results.violations
    .map((v) => `${v.id}: ${v.help} (${v.nodes.length} node(s))`)
    .join("\n");
  expect(summary).toBe("");
}

const statute = getStatute("ica-1872-s74")!;

const findings: GroundedFinding[] = [
  {
    clause: "The entire security deposit shall stand forfeited absolutely.",
    verdict: "void",
    explanation:
      "A penalty written into a contract is an upper limit, not an automatic entitlement.",
    confidence: "high",
    statute,
  },
  {
    clause: "Interest on the security deposit",
    verdict: "missing",
    explanation: "The agreement says nothing about returning the deposit with interest.",
    confidence: "medium",
    statute: getStatute("mta-2021-s11")!,
  },
];

const deadline: Deadline = {
  id: "cpa-complaint:2026-01-12",
  action: "File your consumer complaint",
  dueDate: "2028-01-12",
  daysRemaining: 483,
  status: "safe",
  statute: getStatute("cpa-2019-s69")!,
  customary: false,
  basis: "Two years from the date the cause of action arose.",
  sourceEvent: {
    kind: "consumer_cause_of_action",
    date: "2026-01-12",
    description: "Deposit paid, possession not given",
  },
};

describe("accessibility", () => {
  it("Findings has no WCAG A or AA violations", async () => {
    const { container } = render(<Findings findings={findings} />);
    await expectNoViolations(container);
  });

  it("ClockHero has no WCAG A or AA violations", async () => {
    const { container } = render(<ClockHero deadline={deadline} />);
    await expectNoViolations(container);
  });

  it("DeadlineList has no WCAG A or AA violations", async () => {
    const { container } = render(<DeadlineList deadlines={[deadline]} />);
    await expectNoViolations(container);
  });

  it("Disclaimer has no WCAG A or AA violations", async () => {
    const { container } = render(<Disclaimer />);
    await expectNoViolations(container);
  });
});

describe("findings are legible to assistive technology", () => {
  it("announces an absent protection as absent, not as quoted text", () => {
    render(<Findings findings={findings} />);
    expect(screen.getByText(/Not present in the document/i)).toBeInTheDocument();
  });

  it("ties each clause to its note with aria-describedby", () => {
    const { container } = render(<Findings findings={findings} />);
    const quote = container.querySelector("blockquote");
    const describedBy = quote?.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(container.querySelector(`#${describedBy}`)).toBeTruthy();
  });

  it("shows the citation so a reader can verify it independently", () => {
    render(<Findings findings={findings} />);
    expect(screen.getByText(statute.citation)).toBeInTheDocument();
  });

  it("states an empty result honestly rather than as a clean bill of health", () => {
    render(<Findings findings={[]} />);
    expect(screen.getByText(/not a clean bill of health/i)).toBeInTheDocument();
  });
});

describe("the clock speaks in days, not jargon", () => {
  it("phrases an expired window plainly", () => {
    render(<ClockHero deadline={{ ...deadline, daysRemaining: -3, status: "expired" }} />);
    expect(screen.getByText(/closed 3 days ago/i)).toBeInTheDocument();
  });

  it("phrases the last day without a number that reads as zero", () => {
    render(<ClockHero deadline={{ ...deadline, daysRemaining: 0, status: "critical" }} />);
    expect(screen.getByText(/today is the last day/i)).toBeInTheDocument();
  });

  it("marks a customary window as convention rather than law", () => {
    render(
      <ClockHero
        deadline={{ ...deadline, customary: true, statute: null }}
      />,
    );
    expect(screen.getByText(/convention rather than statute/i)).toBeInTheDocument();
  });
});
