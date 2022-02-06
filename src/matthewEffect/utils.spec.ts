import _ from "lodash";

import { slidingAverage } from "./utils";

describe("utils", () => {
  describe("slidingAverage", () => {
    const numElements = _.random(10, 20);
    const newElement = Math.random();

    it("should return an array with the same length as the given elements", () => {
      const elements = Array.from({ length: numElements }, () => Math.random());
      expect(slidingAverage(elements, newElement)).toHaveLength(
        elements.length
      );
    });

    it("should return an array that is identical to the given elements if they are all the same and the newElement is the same", () => {
      const element = Math.random();
      const elements = Array.from<number>({ length: numElements }).fill(
        element
      );
      slidingAverage(elements, element).forEach((resultElement, index) => {
        expect(resultElement).toBeCloseTo(elements[index], 8);
      });
    });
  });
});
