import _ from "lodash";

const NUM_PLAYERS = 10;
const balances = Array.from({ length: NUM_PLAYERS }, () => 100);

let numRounds = 0;
while (balances.filter((balance) => balance > 0).length > 1) {
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
  if (numRounds++ % 10000 === 0)
    console.log(JSON.stringify({ amounts: balances }));
}

console.log({ amounts: balances, numRounds });
