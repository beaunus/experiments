import Benchmark from "benchmark";
import chalk from "chalk";
import _ from "lodash";

import { BenchmarkEvent, BenchmarkResult } from "./benchmark.types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abbreviate = require("abbreviate") as (
  string: string,
  options: { length: number }
) => string;

const MIN_INPUT_SIZE = 1;
const MAX_INPUT_SIZE = 10000;

const startingHue = _.random(0, 100);
const numInputSizes = Math.log10(MAX_INPUT_SIZE / MIN_INPUT_SIZE) || 1;

for (
  let INPUT_SIZE = MIN_INPUT_SIZE, i = 0;
  INPUT_SIZE <= MAX_INPUT_SIZE;
  INPUT_SIZE *= 10, ++i
) {
  const thisChalkColor = chalk.hsl(
    startingHue + ((i * (360 / numInputSizes)) % 360),
    100,
    50
  );

  const array = Array.from({ length: INPUT_SIZE }, () => Math.random());
  const set = new Set(array);
  const object = Object.fromEntries(array.map((x) => [x, true]));
  const map = new Map(array.map((x) => [x, true]));
  const randomNumber = Math.random();

  const results: Array<BenchmarkResult> = [];

  new Benchmark.Suite()

    // add tests
    .add("array.includes", () => {
      array.includes(randomNumber);
    })
    .add("set.has", () => {
      set.has(randomNumber);
    })
    .add("object.hasOwnProperty", () => {
      Object.prototype.hasOwnProperty.call(object, randomNumber);
    })
    .add("map.has", () => {
      map.has(randomNumber);
    })

    // add listeners
    .on("start", () => {
      console.log(
        thisChalkColor(`\nStarting benchmarks for INPUT_SIZE ${INPUT_SIZE}\n`)
      );
    })
    .on("cycle", (event: BenchmarkEvent) => {
      results.push({
        name: event.target.name,
        // eslint-disable-next-line sort-keys
        hz: event.target.hz,
        "margin of error": `±${Number(event.target.stats.rme).toFixed(2)}%`,
        "runs sampled": event.target.stats.sample.length,
      });
    })
    .on("complete", () => {
      results.sort((a, b) => b.hz - a.hz);

      console.log(thisChalkColor("⏱️  Measurements"));
      console.table(
        results
          .map((result) => ({ ...result, hz: result.hz.toExponential(2) }))
          .reduce((acc, { name, ...cur }) => ({ ...acc, [name]: cur }), {})
      );

      console.log(thisChalkColor("🏁  Comparison Matrix"));
      console.table(
        Object.fromEntries(
          results.map(({ name, hz }) => [
            name,
            Object.fromEntries(
              results.map(({ hz: otherHz, name: otherName }) => [
                abbreviate(otherName, { length: 7 }),
                _.round(hz / otherHz, 2),
              ])
            ),
          ])
        )
      );
    })

    .run({ async: false });
}
