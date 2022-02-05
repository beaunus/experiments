import _ from "lodash";

import { indexesThatSatisfyPredicate } from "./utils";

export const CHOOSING_STRATEGIES: Record<
  "random",
  (balances: number[]) => [number, number]
> = {
  random(balances) {
    const [winnerIndex, loserIndex] = _.sampleSize(
      indexesThatSatisfyPredicate(balances, (index) => balances[index] > 0),
      2
    );
    return [winnerIndex, loserIndex];
  },
};

/* eslint-disable no-param-reassign */
export const REDISTRIBUTION_STRATEGIES: Record<
  "doNothing" | "randomDonor" | "universalBasicIncome",
  (args: {
    balances: number[];
    loserIndex: number;
    numRounds: number;
    winnerIndex: number;
  }) => void
> = {
  doNothing() {
    // No-op
  },
  randomDonor({ balances, loserIndex }) {
    if (balances[loserIndex] === 0) {
      const [donorIndex] = _.sampleSize(
        indexesThatSatisfyPredicate(balances, (index) => balances[index] > 1)
      );
      ++balances[loserIndex];
      --balances[donorIndex];
    }
  },
  universalBasicIncome({ balances, numRounds }) {
    if (numRounds % 100 === 0)
      balances.forEach(
        (_value, index) => (balances[index] = balances[index] * 0.99 + 1)
      );
  },
};
/* eslint-enable no-param-reassign */
