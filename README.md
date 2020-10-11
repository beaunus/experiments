# Utils-ts

A collection of little tools that may help a TypeScript developer throughout the weekend afternoons.

## How to use

### Benchmark

If you want to compare the performance of multiple approaches to a problem:

- Open `src/benchmark.ts`
- Update the `add tests` section to contain the experiments that you wish to measure
  - Be careful to ensure that individual tests are identical in all ways _except for the variation that is being tested_.
- Run `yarn benchmark` or `yarn benchmark:dev`

#### How to read the results

Typical results look something like this:

```
Starting benchmarks for INPUT_SIZE 10000

⏱️  Measurements
┌───────────────────────┬───────────┬─────────────────┬──────────────┐
│        (index)        │    hz     │ margin of error │ runs sampled │
├───────────────────────┼───────────┼─────────────────┼──────────────┤
│        map.has        │ '8.59e+8' │    '±1.59%'     │      88      │
│    array.includes     │ '8.03e+8' │    '±0.99%'     │      79      │
│        set.has        │ '7.18e+7' │    '±0.96%'     │      95      │
│ object.hasOwnProperty │ '2.13e+7' │    '±1.27%'     │      92      │
└───────────────────────┴───────────┴─────────────────┴──────────────┘
🏁  Comparison Matrix
┌───────────────────────┬─────────┬─────────┬─────────┬─────────┐
│        (index)        │ map.has │ arryncl │ set.has │ objctOP │
├───────────────────────┼─────────┼─────────┼─────────┼─────────┤
│        map.has        │    1    │  1.07   │  11.96  │  40.33  │
│    array.includes     │  0.94   │    1    │  11.19  │  37.71  │
│        set.has        │  0.08   │  0.09   │    1    │  3.37   │
│ object.hasOwnProperty │  0.02   │  0.03   │   0.3   │    1    │
└───────────────────────┴─────────┴─────────┴─────────┴─────────┘
```

☝️ This can be interpreted like so...

For an `INPUT_SIZE` of `10000`:

- The code inside the `map.has` test can be executed at a rate of ~`8.59e+8` times per second.
- ...
- The code inside the `object.hasOwnProperty` test can be executed at a rate of ~`2.13e+7` times per second.
- ...
- The code inside the `map.has` test is ~`40.33` times _faster_ than the code inside the `object.hasOwnProperty` test.

Given those results, you can choose which alternative approach to use. 🚀

### Scratchpad

If you want to try something out:

- Open `src/scratchpad.ts`
- Update the code with the thing that you want to try out
- Run `yarn scratchpad` or `yarn scratchpad:dev`