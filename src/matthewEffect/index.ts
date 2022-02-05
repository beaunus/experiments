/* eslint-disable jest/require-hook */
import { ArgumentParser } from "argparse";
import _ from "lodash";

import { sleep } from "../utils";

import {
  logNumOwnersByPercentOwnership,
  logStatistics,
  logStrategies,
} from "./log";
import { CHOOSING_STRATEGIES, REDISTRIBUTION_STRATEGIES } from "./strategies";

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
      logNumOwnersByPercentOwnership(balances, num_players, totalMoneyInGame);
      console.log();
      logStrategies(choosing_strategy, redistribution_strategy);
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
  logNumOwnersByPercentOwnership(balances, num_players, totalMoneyInGame);
  console.log();
  logStrategies(choosing_strategy, redistribution_strategy);
  console.log();
  logStatistics(balances, numRounds);
}
