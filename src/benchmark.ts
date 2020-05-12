import Benchmark from "benchmark";

const suite = new Benchmark.Suite();

// add tests
suite
  .add("RegExp#test", function () {
    /o/.test("Hello World!");
  })
  .add("String#indexOf", function () {
    "Hello World!".indexOf("o") > -1;
  })
  .add("String#match", function () {
    !!"Hello World!".match(/o/);
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
