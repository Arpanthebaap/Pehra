import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/page";
import { SAMPLE_DOCUMENTS } from "@/lib/samples";

describe("Home Page & Sample Picker Interaction", () => {
  it("renders masthead and main heading", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 1, name: /pehra/i });
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("heading", { level: 2, name: /what are you being asked to sign/i })).toBeInTheDocument();
  });

  it("renders sample document chips for all categories", () => {
    render(<Home />);
    for (const sample of SAMPLE_DOCUMENTS) {
      expect(screen.getByRole("button", { name: sample.title.en })).toBeInTheDocument();
    }
  });

  it("loads sample text into textarea when a sample chip is clicked", () => {
    render(<Home />);
    const textarea = screen.getByRole("textbox", { name: /the document/i }) as HTMLTextAreaElement;
    expect(textarea.value).toBe("");

    // Click Job Bond chip
    const employmentSample = SAMPLE_DOCUMENTS.find((s) => s.id === "employment")!;
    const employmentChip = screen.getByRole("button", { name: employmentSample.title.en });
    fireEvent.click(employmentChip);

    expect(textarea.value).toBe(employmentSample.text);
    expect(textarea.value).toContain("Apex Cloud Solutions");
  });

  it("switches language to Hindi and translates form elements and sample chips", () => {
    render(<Home />);
    const langSelect = screen.getByLabelText(/answer me in/i) as HTMLSelectElement;
    fireEvent.change(langSelect, { target: { value: "hi" } });

    expect(screen.getByRole("heading", { level: 2, name: /आपसे क्या हस्ताक्षर करने के लिए कहा जा रहा है/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /किराया समझौता/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /यह दस्तावेज़ पढ़ें/i })).toBeInTheDocument();
  });

  it("switches language to Bengali and translates form elements and sample chips", () => {
    render(<Home />);
    const langSelect = screen.getByLabelText(/answer me in/i) as HTMLSelectElement;
    fireEvent.change(langSelect, { target: { value: "bn" } });

    expect(screen.getByRole("heading", { level: 2, name: /আপনাকে কী স্বাক্ষর করতে বলা হচ্ছে/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ভাড়া চুক্তি/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /এই নথিটি পড়ুন/i })).toBeInTheDocument();
  });

  it("disables the analyze button when textarea is empty or too short", () => {
    render(<Home />);
    const analyzeBtn = screen.getByRole("button", { name: /read this document/i });
    expect(analyzeBtn).toBeDisabled();

    const textarea = screen.getByRole("textbox", { name: /the document/i });
    fireEvent.change(textarea, { target: { value: "Too short" } });
    expect(analyzeBtn).toBeDisabled();

    fireEvent.change(textarea, { target: { value: "A".repeat(50) } });
    expect(analyzeBtn).not.toBeDisabled();
  });
});
