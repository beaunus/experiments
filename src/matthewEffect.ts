/* eslint-disable jest/require-hook */
import { ArgumentParser } from "argparse";
import { plot } from "asciichart";
import _ from "lodash";
import { max, mean, median, min, std } from "mathjs";

import { sleep } from "./utils";

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

const parser = new ArgumentParser({ description: "Matthew Effect visualizer" });

parser.add_argument("-c", "--choosing-strategy", {
  choices: Object.keys(CHOOSING_STRATEGIES),
  default: "random",
});
parser.add_argument("-n", "--num-players", { default: 20, type: Number });
parser.add_argument("-r", "--redistribution-strategy", {
  choices: Object.keys(REDISTRIBUTION_STRATEGIES),
  default: "doNothing",
});
parser.add_argument("-s", "--starting-balance", { default: 100, type: Number });

/* eslint-disable @typescript-eslint/naming-convention */
const {
  choosing_strategy,
  num_players,
  redistribution_strategy,
  starting_balance,
} = parser.parse_args() as {
  choosing_strategy: keyof typeof CHOOSING_STRATEGIES;
  num_players: number;
  redistribution_strategy: keyof typeof REDISTRIBUTION_STRATEGIES;
  starting_balance: number;
};
/* eslint-enable @typescript-eslint/naming-convention */

const totalMoneyInGame = num_players * starting_balance;

main();

async function main() {
  const balances = Array.from({ length: num_players }, () => starting_balance);

  let numRounds = 0;
  while (balances.filter((balance) => balance > 0).length > 1) {
    if (numRounds % 1000 === 0) {
      await sleep(10);
      console.clear();
      logNumOwnersByPercentOwnership(balances);
      console.log();
      logStrategies();
      console.log();
      logStatistics(balances, numRounds);
    }
    const [winnerIndex, loserIndex] =
      CHOOSING_STRATEGIES[choosing_strategy](balances);
    ++balances[winnerIndex];
    --balances[loserIndex];

    REDISTRIBUTION_STRATEGIES[redistribution_strategy]({
      balances,
      loserIndex,
      numRounds,
      winnerIndex,
    });
    ++numRounds;
  }

  console.clear();
  logNumOwnersByPercentOwnership(balances);
  console.log();
  logStrategies();
  console.log();
  logStatistics(balances, numRounds);
}

function indexesThatSatisfyPredicate<T>(
  elements: T[],
  predicate: (index: number) => boolean
) {
  return _.range(0, elements.length).filter(predicate);
}

function logNumOwnersByPercentOwnership(balances: number[]) {
  console.log(
    plot(numPlayersByPercentOwnership(balances), {
      height: num_players,
      max: num_players,
      offset: 5,
    })
  );
  console.log("↑ numPlayers");
  console.log(
    `→ % ownership  ${_.range(0, 11)
      .map((x) => 10 * x)
      .join("        ")}`
  );
}

function logStrategies() {
  console.log(`             CHOOSING_STRATEGY: ${choosing_strategy}`);
  console.log(`       REDISTRIBUTION_STRATEGY: ${redistribution_strategy}`);
}

function logStatistics(balances: number[], numRounds: number) {
  console.log(`                     numRounds: ${numRounds}`);
  console.log();
  console.log(`                 sum(balances): ${_.sum(balances)}`);
  console.log(`                 std(balances): ${std(balances)}`);
  console.log(`                mean(balances): ${mean(balances)}`);
  console.log(`              median(balances): ${median(balances)}`);
  console.log(`                 min(balances): ${min(balances)}`);
  console.log(`                 max(balances): ${max(balances)}`);
}

function numPlayersByPercentOwnership(balances: number[]) {
  const balancesByRoundedBalance = _.groupBy(balances, (balance) =>
    _.round((100 * balance) / totalMoneyInGame)
  );
  return Array.from({ length: 101 }).map(
    (_value, index) => balancesByRoundedBalance[index]?.length ?? 0
  );
}
