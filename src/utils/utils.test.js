import { getPattern } from "./utils";

describe("getting patterns", () => {
  const input = {
    patternName: "none",
    cellSize: 10,
    width: 200,
    height: 200
  };

  test("will get the blinker pattern", () => {
    const updatedInput = { ...input, patternName: "blinker" };
    expect(getPattern(updatedInput)).toEqual({ cells: [209, 210, 211] });
  });

  test("will get the glider pattern", () => {
    const updatedInput = { ...input, patternName: "glider" };
    expect(getPattern(updatedInput)).toEqual({
      cells: [170, 191, 209, 210, 211]
    });
  });

  test("will get the toad pattern", () => {
    const updatedInput = { ...input, patternName: "toad" };
    expect(getPattern(updatedInput)).toEqual({
      cells: [190, 191, 192, 209, 210, 211]
    });
  });

  test("will get the beacon pattern", () => {
    const updatedInput = { ...input, patternName: "beacon" };
    expect(getPattern(updatedInput)).toEqual({
      cells: [189, 190, 209, 210, 231, 232, 251, 252]
    });
  });

  test("will get the pulsar pattern", () => {
    const updatedInput = { ...input, patternName: "pulsar" };
    expect(getPattern(updatedInput)).toEqual({
      cells: [149, 150, 151, 170, 250, 269, 270, 271]
    });
  });

  test("will get the pentaDecathlon pattern", () => {
    const updatedInput = { ...input, patternName: "pentaDecathlon" };
    expect(getPattern(updatedInput)).toEqual({
      cells: [150, 169, 170, 171, 269, 270, 271, 290]
    });
  });

  test("will get the spaceShip pattern", () => {
    const updatedInput = { ...input, patternName: "spaceShip" };
    expect(getPattern(updatedInput)).toEqual({
      cells: [151, 154, 170, 190, 194, 210, 211, 212, 213]
    });
  });

  test("will get an empty pattern", () => {
    const updatedInput = { ...input, patternName: "none" };
    expect(getPattern(updatedInput)).toEqual({
      cells: []
    });
  });
});
