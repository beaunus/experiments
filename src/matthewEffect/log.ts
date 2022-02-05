import { plot } from "asciichart";
import _ from "lodash";
import { max, mean, median, min, std } from "mathjs";

import { CHOOSING_STRATEGIES, REDISTRIBUTION_STRATEGIES } from "./strategies";
import { numPlayersByPercentOwnership } from "./utils";

export function logNumOwnersByPercentOwnership(
  balances: number[],
  numPlayers: number,
  totalMoneyInGame: number
) {
  console.log(
    plot(numPlayersByPercentOwnership(balances, totalMoneyInGame), {
      height: numPlayers,
      max: numPlayers,
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

export function logStatistics(balances: number[], numRounds: number) {
  console.log(`                     numRounds: ${numRounds}`);
  console.log();
  console.log(`                 sum(balances): ${_.sum(balances)}`);
  console.log(`                 std(balances): ${std(balances)}`);
  console.log(`                mean(balances): ${mean(balances)}`);
  console.log(`              median(balances): ${median(balances)}`);
  console.log(`                 min(balances): ${min(balances)}`);
  console.log(`                 max(balances): ${max(balances)}`);
}

export function logStrategies(
  choosingStrategy: keyof typeof CHOOSING_STRATEGIES,
  redistributionStrategy: keyof typeof REDISTRIBUTION_STRATEGIES
) {
  console.log(`              choosingStrategy: ${choosingStrategy}`);
  console.log(`        redistributionStrategy: ${redistributionStrategy}`);
}
