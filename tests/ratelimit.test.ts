import { beforeEach, describe, expect, it } from "vitest";
import { clientKey, evictExpired, getTrackedKeyCount, rateLimit, resetRateLimiter } from "@/lib/ratelimit";

beforeEach(() => resetRateLimiter());

describe("rateLimit", () => {
  it("allows requests up to the limit", () => {
    for (let i = 0; i < 6; i += 1) {
      expect(rateLimit("1.2.3.4", 1_000).allowed).toBe(true);
    }
  });

  it("blocks the request after the limit and says how long to wait", () => {
    for (let i = 0; i < 6; i += 1) rateLimit("1.2.3.4", 1_000);
    const blocked = rateLimit("1.2.3.4", 1_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("keeps separate budgets per client", () => {
    for (let i = 0; i < 6; i += 1) rateLimit("1.2.3.4", 1_000);
    expect(rateLimit("5.6.7.8", 1_000).allowed).toBe(true);
  });

  it("opens a fresh window once the old one has passed", () => {
    for (let i = 0; i < 6; i += 1) rateLimit("1.2.3.4", 1_000);
    expect(rateLimit("1.2.3.4", 62_000).allowed).toBe(true);
  });

  it("periodically sweeps expired windows", () => {
    // Fill with entries at t=1000
    for (let i = 0; i < 50; i += 1) {
      rateLimit(`ip-old-${i}`, 1_000);
    }
    expect(getTrackedKeyCount()).toBe(50);
    // At t=70000, run another 50 requests to hit the next sweep interval
    for (let i = 0; i < 50; i += 1) {
      rateLimit(`ip-new-${i}`, 70_000);
    }
    // All 50 old entries should have been purged during the sweep at call 100
    expect(getTrackedKeyCount()).toBe(50);
  });

  it("evictExpired immediately removes records past resetAt", () => {
    rateLimit("ip-1", 10_000);
    rateLimit("ip-2", 20_000);
    expect(getTrackedKeyCount()).toBe(2);
    // At t=75_000, ip-1 (resetAt=70_000) is expired, ip-2 (resetAt=80_000) is not
    evictExpired(75_000);
    expect(getTrackedKeyCount()).toBe(1);
  });
});

describe("clientKey", () => {
  it("takes the first address from x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" });
    expect(clientKey(headers)).toBe("9.9.9.9");
  });

  it("falls back to x-real-ip", () => {
    expect(clientKey(new Headers({ "x-real-ip": "8.8.8.8" }))).toBe("8.8.8.8");
  });

  it("degrades to a shared bucket rather than to no limiting at all", () => {
    expect(clientKey(new Headers())).toBe("anonymous");
  });
});
