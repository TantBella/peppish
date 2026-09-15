import { describe, expect, it } from "vitest";
import { normalizeBalanceResponse } from "./rewardService.api";

describe("normalizeBalanceResponse", () => {
  it("maps backend balance fields to the frontend display shape", () => {
    expect(
      normalizeBalanceResponse({
        userId: "user-123",
        moneyBalance: 250.5,
        totalXp: 420,
        level: 5,
      }),
    ).toEqual({
      userId: "user-123",
      totalMoney: 250.5,
      totalProgress: 420,
      moneyBalance: 250.5,
      totalXp: 420,
      level: 5,
    });
  });
});
