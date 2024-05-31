import { getPattern } from "./utils";

describe("getting patterns", () => {
  const input = {
    activePattern: "none",
    cellSize: 10,
    width: 200,
    height: 200
  };

  test("will get the blinker pattern", () => {
    const updatedInput = { ...input, activePattern: "blinker" };
    expect(getPattern(updatedInput)).toEqual({ liveCells: [209, 210, 211] });
  });

  test("will get the glider pattern", () => {
    const updatedInput = { ...input, activePattern: "glider" };
    expect(getPattern(updatedInput)).toEqual({
      liveCells: [170, 191, 209, 210, 211]
    });
  });

  test("will get the toad pattern", () => {
    const updatedInput = { ...input, activePattern: "toad" };
    expect(getPattern(updatedInput)).toEqual({
      liveCells: [190, 191, 192, 209, 210, 211]
    });
  });

  test("will get the beacon pattern", () => {
    const updatedInput = { ...input, activePattern: "beacon" };
    expect(getPattern(updatedInput)).toEqual({
      liveCells: [189, 190, 209, 210, 231, 232, 251, 252]
    });
  });

  test("will get the pulsar pattern", () => {
    const updatedInput = { ...input, activePattern: "pulsar" };
    expect(getPattern(updatedInput)).toEqual({
      liveCells: [149, 150, 151, 170, 250, 269, 270, 271]
    });
  });

  test("will get the pentaDecathlon pattern", () => {
    const updatedInput = { ...input, activePattern: "pentaDecathlon" };
    expect(getPattern(updatedInput)).toEqual({
      liveCells: [150, 169, 170, 171, 269, 270, 271, 290]
    });
  });

  test("will get the spaceShip pattern", () => {
    const updatedInput = { ...input, activePattern: "spaceShip" };
    expect(getPattern(updatedInput)).toEqual({
      liveCells: [151, 154, 170, 190, 194, 210, 211, 212, 213]
    });
  });

  test("will get an empty pattern", () => {
    const updatedInput = { ...input, activePattern: "none" };
    expect(getPattern(updatedInput)).toEqual({
      liveCells: []
    });
  });
});
