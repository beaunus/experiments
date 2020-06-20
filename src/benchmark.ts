import { BenchmarkEvent, BenchmarkResult } from "./benchmark.types";
import Benchmark from "benchmark";
import _ from "lodash";

const MIN_INPUT_SIZE = 1;
const MAX_INPUT_SIZE = 10000;

for (
  let INPUT_SIZE = MIN_INPUT_SIZE;
  INPUT_SIZE <= MAX_INPUT_SIZE;
  INPUT_SIZE *= 10
) {
  const array = Array.from({ length: INPUT_SIZE }, () => Math.random());
  const set = new Set(array);
  const object = Object.fromEntries(array.map((x) => [x, true]));
  const map = new Map(array.map((x) => [x, true]));

  const results: Array<BenchmarkResult> = [];

  new Benchmark.Suite()

    // add tests
    .add("array.includes", () => {
      array.includes(Math.random());
    })
    .add("set.has", () => {
      set.has(Math.random());
    })
    .add("object.hasOwnProperty", () => {
      Object.prototype.hasOwnProperty.call(object, Math.random());
    })
    .add("map.has", () => {
      map.has(Math.random());
    })

    // add listeners
    .on("start", () => {
      console.log(`\nStarting benchmarks for INPUT_SIZE ${INPUT_SIZE}`);
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
      const lowestHz = results[results.length - 1].hz;

      console.table(
        results
          .map((result) => ({
            ...result,
            hz: result.hz.toExponential(2),
            numTimesFaster: _.round(result.hz / lowestHz, 2),
          }))
          .reduce((acc, { name, ...cur }) => ({ ...acc, [name]: cur }), {})
      );
    })

    .run({ async: false });
}
