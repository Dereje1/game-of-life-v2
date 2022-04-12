import { getCoordinatesFromIndex, getIndexFromCoordinates } from "./utils";

const getContext = (canvas) => canvas.getContext("2d");

const drawGrid = ({ context, canvasWidth, canvasHeight, cellSize, color }) => {
  for (let x = 0; x <= canvasWidth; x += cellSize) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvasHeight);
    context.strokeStyle = color;
    context.stroke();
  }
  for (let y = 0; y <= canvasHeight; y += cellSize) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvasWidth, y);
    context.strokeStyle = color;
    context.stroke();
  }
};

export const setBackGroundColor = ({ canvas, backgroundColor }) =>
  (canvas.style.backgroundColor = backgroundColor);

export const getIndexFromClick = ({ canvas, clientX, clientY, ...args }) => {
  const { left, top } = canvas.getBoundingClientRect();
  const trueX = clientX - left;
  const trueY = clientY - top;
  const index = getIndexFromCoordinates({
    x: trueX,
    y: trueY,
    ...args
  });
  return index;
};

export const drawLiveCells = ({
  canvas,
  cells,
  canvasWidth,
  canvasHeight,
  cellSize,
  colors: { liveCell, grid },
  showGrid
}) => {
  const context = getContext(canvas);
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  cells.forEach((cell) => {
    const [x, y] = getCoordinatesFromIndex({
      index: cell,
      width: canvasWidth,
      cellSize
    });
    context.fillStyle = liveCell;
    context.fillRect(x, y, cellSize, cellSize);
  });
  if (showGrid) {
    drawGrid({ context, canvasWidth, canvasHeight, cellSize, color: grid });
  }
};
