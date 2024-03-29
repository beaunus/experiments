import Benchmark from "benchmark";

export interface BenchmarkEvent extends Benchmark.Event {
  target: {
    hz: number;
    id: number;
    name: string;
    options: Benchmark.Options;
    running: boolean;
    stats: {
      deviation: number;
      mean: number;
      moe: number;
      rme: number;
      sample: unknown[];
      sem: number;
      variance: number;
    };
  };
}

export interface BenchmarkResult {
  hz: number;
  "margin of error": string;
  name: string;
  "runs sampled": number;
}
