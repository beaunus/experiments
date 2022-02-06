/* eslint-disable jest/require-hook */
import { ArgumentParser } from "argparse";
import {
  blue,
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
import _ from "lodash";
import { max } from "mathjs";

import { sleep } from "../utils";

import { logEverything } from "./log";
import {
  ChoosingStrategy,
  CHOOSING_STRATEGIES,
  RedistributionStrategy,
  REDISTRIBUTION_STRATEGIES,
} from "./strategies";
import { slidingAverage } from "./utils";

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
  const snapshots1: number[][] = balances.map((balance) => [balance]);
  let snapshots2: number[][] = balances.map((balance) =>
    Array.from({ length: 100 }, () => balance)
  );

  let numRounds = 0;
  while (balances.filter((balance) => balance > 0).length > 1) {
    if (numRounds % 10000 === 0) {
      await sleep(10);
      logEverything({
        balances,
        choosingStrategy: choosing_strategy,
        numRounds,
        redistributionStrategy: redistribution_strategy,
        totalMoneyInGame,
      });
      thing1(snapshots1);
      thing2(snapshots2);
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
    snapshots1.forEach((snapshot, index) => snapshot.push(balances[index]));
    snapshots2 = snapshots2.map((snapshotThing, playerIndex) =>
      slidingAverage(snapshotThing, balances[playerIndex])
    );
    ++numRounds;
  }

  logEverything({
    balances,
    choosingStrategy: choosing_strategy,
    numRounds,
    redistributionStrategy: redistribution_strategy,
    totalMoneyInGame,
  });
  thing1(snapshots1);
  thing2(snapshots2);
}

function thing1(snapshots: number[][]) {
  console.log(
    plot(
      snapshots.map((snapshot) =>
        _.chunk(snapshot, Math.ceil(snapshot.length / 100)).map((chunk) =>
          max(chunk)
        )
      ),
      {
        colors: [
          red,
          green,
          yellow,
          blue,
          magenta,
          lightgray,
          lightred,
          lightgreen,
          lightyellow,
          lightblue,
          lightmagenta,
          lightcyan,
        ],
        height: 20,
      }
    )
  );
}

function thing2(snapshots: number[][]) {
  console.log(
    plot(snapshots, {
      colors: [
        red,
        green,
        yellow,
        blue,
        magenta,
        lightgray,
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
