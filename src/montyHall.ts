/* eslint-disable jest/require-hook */
import _ from "lodash";

const NUM_TRIALS = 1000000;

// Store the results from running the "verbose" experiment
const numWinsByStrategyVerbose = { stay: 0, swap: 0 };
for (let i = 0; i < NUM_TRIALS; ++i) {
  // There are 3 doors, numbered 0, 1, 2

  // Monty chooses one of the doors to contain the PRIZE
  const prizeDoorIndex = _.random(2);
  // The player makes a "first" choice
  const playerOriginalChoice = _.random(2);

  // Monty reveals what is behind one of the non-chosen, non-prize doors
  const [montyRevealIndex] = _.range(3).filter(
    (x) => x !== prizeDoorIndex && x !== playerOriginalChoice
  );
  // Determine which door the player would choose,
  // if they swapped their choice in light of the new information.
  const [swapIndex] = _.range(3).filter(
    (x) => x !== playerOriginalChoice && x !== montyRevealIndex
  );

  if (playerOriginalChoice === prizeDoorIndex) ++numWinsByStrategyVerbose.stay;
  if (swapIndex === prizeDoorIndex) ++numWinsByStrategyVerbose.swap;
}

/**
 * On close examination of the conditional increments (lines 26 and 27),
 * you can see that the conditions are mutually exclusive.
 * Thus, the second `if` statement can be changed to an `else` block.
 *
 * In that case, you can remove many of the unused variables and logic.
 * Then, the problem is greatly simplified. (See below)
 */

// Store the results from running the "concise" experiment
const numWinsByStrategyConcise = { stay: 0, swap: 0 };
for (let i = 0; i < NUM_TRIALS; ++i) {
  // There are 3 doors, numbered 0, 1, 2

  // Monty chooses one of the doors to contain the PRIZE
  const prizeDoorIndex = _.random(2);
  // The player makes a "first" choice
  const playerOriginalChoice = _.random(2);

  if (playerOriginalChoice === prizeDoorIndex) ++numWinsByStrategyConcise.stay;
  else ++numWinsByStrategyConcise.swap;
}

/**
 * Both implementations lead to the same approximate outcome.
 *
 * Namely, the Monty Hall problem can be reduced to:
 *
 * The probability of winning if you SWAP is:
 * (1 - the probability of STAYING)
 *
 * Which is identical to:
 * (1 - the probability of choosing the prize door on your FIRST GUESS)
 *
 * I.e.
 * P(firstGuessIsPrize) = 1/3
 * P(winningIfYouSwap)  = 1 - (1/3) = 2/3
 *
 * "Swapping" is TWICE as likely to win than "staying".
 */

console.log({ numWinsByStrategyConcise, numWinsByStrategyVerbose });
