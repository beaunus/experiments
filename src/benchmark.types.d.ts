import Benchmark from "benchmark";

export interface BenchmarkEvent extends Benchmark.Event {
  target: {
    name: string;
    hz: number;
    stats: { rme: number; sample: { length: number } };
  };
}

export interface BenchmarkResult {
  name: string;
  hz: number;
  "margin of error": string;
  "runs sampled": number;
}
