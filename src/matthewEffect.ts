/* eslint-disable jest/require-hook */
import { plot } from "asciichart";
import _ from "lodash";

const NUM_PLAYERS = 20;
const balances = Array.from({ length: NUM_PLAYERS }, () => 100);

let numRounds = 0;

async function main() {
  while (balances.filter((balance) => balance > 0).length > 1) {
    if (numRounds++ % 100 === 0) {
      await sleep(10);
      console.clear();
      console.log(
        plot(
          Array.from(
            { length: 101 },
            (_v, k) =>
              balances.filter((x) => x >= k * 10 && x < (k + 1) * 10).length
          ),
          { height: _.clamp(NUM_PLAYERS, 0, 30), max: NUM_PLAYERS }
        )
      );
    }
    const indicesWithPositiveBalance = balances
      .map((_value, index) => index)
      .filter((index) => balances[index]);
    const player1Index = _.sample(indicesWithPositiveBalance) ?? 0;
    const player2Index =
      _.sample(
        indicesWithPositiveBalance.filter((index) => index !== player1Index)
      ) ?? 0;
    ++balances[player1Index];
    --balances[player2Index];

    if (balances[player2Index] === 0) {
      const donorIndex =
        _.sample(
          balances
            .map((_value, index) => index)
            .filter((index) => balances[index] > 1)
        ) ?? 0;
      ++balances[player2Index];
      --balances[donorIndex];
    }
  }

  console.log(
    plot(
      Array.from(
        { length: 101 },
        (_v, k) =>
          balances.filter((x) => x >= k * 10 && x < (k + 1) * 10).length
      ),
      { height: 10 }
    )
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main();
