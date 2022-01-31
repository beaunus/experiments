/* eslint-disable jest/require-hook */
import { plot } from "asciichart";
import _ from "lodash";

import { sleep } from "./utils";

const NUM_PLAYERS = 20;
const STARTING_BALANCE = 100;
const totalMoneyInGame = NUM_PLAYERS * STARTING_BALANCE;

main();

async function main() {
  const balances = Array.from({ length: NUM_PLAYERS }, () => STARTING_BALANCE);

  let numRounds = 0;
  while (balances.filter((balance) => balance > 0).length > 1) {
    if (numRounds++ % 1000 === 0) {
      await sleep(10);
      logNumOwnersByPercentOwnership(balances);
    }
    const [winnerIndex, loserIndex] = CHOOSING_STRATEGIES.random(balances);
    ++balances[winnerIndex];
    --balances[loserIndex];

    REDISTRIBUTION_STRATEGIES.randomDonor({
      balances,
      loserIndex,
      winnerIndex,
    });
  }

  logNumOwnersByPercentOwnership(balances);
}

const CHOOSING_STRATEGIES: Record<
  string,
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
  string,
  (args: {
    balances: number[];
    loserIndex: number;
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
};
/* eslint-enable no-param-reassign */

function indexesThatSatisfyPredicate<T>(
  elements: T[],
  predicate: (index: number) => boolean
) {
  return _.range(0, elements.length).filter(predicate);
}

function logNumOwnersByPercentOwnership(balances: number[]) {
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
  console.log(_.sum(balances));
}

function numPlayersByPercentOwnership(balances: number[]) {
  const balancesByRoundedBalance = _.groupBy(balances, (balance) =>
    _.round((100 * balance) / totalMoneyInGame)
  );
  return Array.from({ length: 101 }).map(
    (_value, index) => balancesByRoundedBalance[index]?.length ?? 0
  );
}
