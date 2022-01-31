/* eslint-disable jest/require-hook */
import { plot } from "asciichart";
import _ from "lodash";

import { sleep } from "./utils";

const CHOOSING_STRATEGY: keyof typeof CHOOSING_STRATEGIES = "random";
const REDISTRIBUTION_STRATEGY: keyof typeof REDISTRIBUTION_STRATEGIES =
  "universalBasicIncome";

const NUM_PLAYERS = 20;
const STARTING_BALANCE = 100;
const totalMoneyInGame = NUM_PLAYERS * STARTING_BALANCE;

main();

async function main() {
  const balances = Array.from({ length: NUM_PLAYERS }, () => STARTING_BALANCE);

  let numRounds = 0;
  while (balances.filter((balance) => balance > 0).length > 1) {
    if (numRounds % 1000 === 0) {
      await sleep(10);
      logNumOwnersByPercentOwnership(balances, numRounds);
    }
    const [winnerIndex, loserIndex] =
      CHOOSING_STRATEGIES[CHOOSING_STRATEGY](balances);
    ++balances[winnerIndex];
    --balances[loserIndex];

    REDISTRIBUTION_STRATEGIES[REDISTRIBUTION_STRATEGY]({
      balances,
      loserIndex,
      numRounds,
      winnerIndex,
    });
    ++numRounds;
  }

  logNumOwnersByPercentOwnership(balances, numRounds);
}

const CHOOSING_STRATEGIES: Record<
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
const REDISTRIBUTION_STRATEGIES: Record<
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

function indexesThatSatisfyPredicate<T>(
  elements: T[],
  predicate: (index: number) => boolean
) {
  return _.range(0, elements.length).filter(predicate);
}

function logNumOwnersByPercentOwnership(balances: number[], numRounds: number) {
  console.clear();
  console.log(
    plot(numPlayersByPercentOwnership(balances), {
      height: NUM_PLAYERS,
      max: NUM_PLAYERS,
    })
  );
  console.log(
    `% ownership  ${_.range(0, 11)
      .map((x) => 10 * x)
      .join("        ")}`
  );
  console.log();
  console.log(`              sum(balances): ${_.sum(balances)}`);
  console.log(`                  numRounds: ${numRounds}`);
  console.log(`          CHOOSING_STRATEGY: ${CHOOSING_STRATEGY}`);
  console.log(`    REDISTRIBUTION_STRATEGY: ${REDISTRIBUTION_STRATEGY}`);
}

function numPlayersByPercentOwnership(balances: number[]) {
  const balancesByRoundedBalance = _.groupBy(balances, (balance) =>
    _.round((100 * balance) / totalMoneyInGame)
  );
  return Array.from({ length: 101 }).map(
    (_value, index) => balancesByRoundedBalance[index]?.length ?? 0
  );
}
