import _ from "lodash";

export function indexesThatSatisfyPredicate<T>(
  elements: T[],
  predicate: (index: number) => boolean
) {
  return _.range(0, elements.length).filter(predicate);
}

export function numPlayersByPercentOwnership(
  balances: number[],
  totalMoneyInGame: number
) {
  const balancesByRoundedBalance = _.groupBy(balances, (balance) =>
    _.round((100 * balance) / totalMoneyInGame)
  );
  return Array.from({ length: 101 }).map(
    (_value, index) => balancesByRoundedBalance[index]?.length ?? 0
  );
}
