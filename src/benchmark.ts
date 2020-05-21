import * as _ from "lodash";
import Benchmark from "benchmark";

const MAX_INPUT_SIZE = 1000;

for (let inputSize = 1; inputSize <= MAX_INPUT_SIZE; inputSize *= 10) {
  const suite = new Benchmark.Suite();
  console.group(`inputSize: ${inputSize}`);
  const array = Array.from({ length: inputSize }, () => Math.random());

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
    .run({ async: false });
  console.groupEnd();
}
