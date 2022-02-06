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

export function slidingAverage(elements: number[], newElement: number) {
  return elements.map((element, index) => {
    const oldPortion =
      ((elements.length - index) / (elements.length + 1)) * element;
    const newPortion =
      ((index + 1) / (elements.length + 1)) *
      (elements[index + 1] ?? newElement);
    return oldPortion + newPortion;
  });
}
