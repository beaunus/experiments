/* eslint-disable jest/require-hook */
import { ArgumentParser } from "argparse";
import {
  blue,
  cyan,
  darkgray,
  green,
  lightblue,
  lightcyan,
  lightgray,
  lightgreen,
  lightmagenta,
  lightred,
  lightyellow,
  magenta,
  plot,
  red,
  yellow,
} from "asciichart";
import _, { mean } from "lodash";
import { max } from "mathjs";

import { sleep } from "../utils";

import { logEverything } from "./log";
import {
  ChoosingStrategy,
  CHOOSING_STRATEGIES,
  RedistributionStrategy,
  REDISTRIBUTION_STRATEGIES,
} from "./strategies";

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
  choosing_strategy: ChoosingStrategy;
  num_players: number;
  redistribution_strategy: RedistributionStrategy;
  starting_balance: number;
};
/* eslint-enable @typescript-eslint/naming-convention */

const totalMoneyInGame = num_players * starting_balance;

main();

async function main() {
  const balances = Array.from({ length: num_players }, () => starting_balance);
  let balancesByPlayerIndex: number[][] = balances.map((balance) =>
    Array.from({ length: 100 }, () => balance)
  );

  let numRounds = 0;
  while (balances.filter((balance) => balance > 0).length > 1) {
    if (numRounds % 1000 === 0) {
      await sleep(10);
      logEverything({
        balances,
        choosingStrategy: choosing_strategy,
        numRounds,
        redistributionStrategy: redistribution_strategy,
        totalMoneyInGame,
      });
      thing(balancesByPlayerIndex);
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
    balancesByPlayerIndex = balancesByPlayerIndex.map(
      (balancesForThisPlayer, playerIndex) =>
        balancesForThisPlayer.map(
          (balance, index) =>
            ((100 - index) / 101) * balance +
            ((index + 1) / 101) *
              (balancesForThisPlayer[index + 1] ?? balances[playerIndex])
        )
    );
    // process.exit(0);
    ++numRounds;
  }

  logEverything({
    balances,
    choosingStrategy: choosing_strategy,
    numRounds,
    redistributionStrategy: redistribution_strategy,
    totalMoneyInGame,
  });
  thing(balancesByPlayerIndex);
}

function thing(balancesByPlayerIndex: number[][]) {
  console.log(
    plot(balancesByPlayerIndex, {
      colors: [
        red,
        green,
        yellow,
        blue,
        magenta,
        // cyan,
        lightgray,
        // darkgray,
        lightred,
        lightgreen,
        lightyellow,
        lightblue,
        lightmagenta,
        lightcyan,
      ],
      height: 20,
    })
  );
}
