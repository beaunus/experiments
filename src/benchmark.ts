import * as _ from "lodash";
import Benchmark from "benchmark";

const suite = new Benchmark.Suite();

const INPUT_SIZE = 1000;

const array = Array.from({ length: INPUT_SIZE }, () => Math.random());

// add tests
suite
  .add("built-in", function () {
    const thing = array.map((x) => x * 2);
  })
  .add("Lodash", function () {
    const thing = _.map(array, (x) => x * 2);
  })
  // add listeners
  .on("cycle", function (event: Benchmark.Event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log(
      "Fastest is " +
        suite.filter("fastest").map(({ name }: { name: string }) => name)
    );
  })
  // run async
  .run({ async: true });
