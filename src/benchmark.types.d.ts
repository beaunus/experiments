import Benchmark from "benchmark";

export interface BenchmarkEvent extends Benchmark.Event {
  target: {
    name: string;
    hz: number;
    id: number;
    running: boolean;
    options: Benchmark.Options;
    stats: {
      rme: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sample: any[];
      deviation: number;
      mean: number;
      moe: number;
      sem: number;
      variance: number;
    };
  };
}

export interface BenchmarkResult {
  name: string;
  hz: number;
  "margin of error": string;
  "runs sampled": number;
}
