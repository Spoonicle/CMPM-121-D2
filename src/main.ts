import { StrokeCommand } from "./commands.ts";
import type { DrawingCommand, Point } from "./types.ts";
import { exportImage } from "./export.ts";

const app = document.querySelector<HTMLElement>("#app")!;

// Create our UI
const heading = document.createElement("h1");
heading.textContent = "D2 project";

const message = document.createElement("p");
message.textContent = "Your project starts here.";

// Create our Canvas
const canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 400;
canvas.style.border = "1px solid #ccc";
canvas.style.display = "block";
canvas.style.cursor = "crosshair";

// Create our Toolbar
const toolbar = document.createElement("div");
toolbar.style.marginBottom = "8px";
toolbar.id = "toolbar";

const undoBtn = document.createElement("button");
undoBtn.textContent = "Undo";
undoBtn.disabled = true;

const redoBtn = document.createElement("button");
redoBtn.textContent = "Redo";
redoBtn.disabled = true;

const redrawBtn = document.createElement("button");
redrawBtn.textContent = "Redraw";
redrawBtn.addEventListener("click", () => {
  redraw();
});

const exportBtn = document.createElement("button");
exportBtn.textContent = "Export";
exportBtn.addEventListener("click", () => {
  exportImage(undoStack, canvas.width, canvas.height, 2);
});

toolbar.append(undoBtn, redoBtn, redrawBtn, exportBtn);

app.append(heading, message, toolbar, canvas);

const ctx = canvas.getContext("2d")!;

const undoStack: DrawingCommand[] = [];
const redoStack: DrawingCommand[] = [];

let currentPoints: Point[] | null = null;

function updateButtons() {
  undoBtn.disabled = undoStack.length === 0;
  redoBtn.disabled = redoStack.length === 0;
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const cmd of undoStack) {
    cmd.render(ctx);
  }

  if (currentPoints && currentPoints.length > 0) {
    const tempStroke = new StrokeCommand(currentPoints, 2, "#000000");
    tempStroke.render(ctx);
  }

  updateButtons();
}

// Pointer Event Handler
function getCanvasCoordinates(e: PointerEvent): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

canvas.addEventListener("pointerdown", (e) => {
  canvas.setPointerCapture(e.pointerId);
  currentPoints = [getCanvasCoordinates(e)];
  redraw();
});

canvas.addEventListener("pointermove", (e) => {
  if (!currentPoints) return;
  currentPoints.push(getCanvasCoordinates(e));
  redraw();
});

undoBtn.addEventListener("click", () => {
  if (undoStack.length === 0) return;
  const undone = undoStack.pop()!;
  redoStack.push(undone);
  redraw();
});

redoBtn.addEventListener("click", () => {
  if (redoStack.length === 0) return;
  const redone = redoStack.pop()!;
  undoStack.push(redone);
  redraw();
});

function finishGesture() {
  if (currentPoints && currentPoints.length > 0) {
    undoStack.push(new StrokeCommand(currentPoints, 2, "#000000"));
    redoStack.length = 0;
    currentPoints = null;
    redraw();
  }
}

function cancelGesture() {
  currentPoints = null;
  redraw();
}

canvas.addEventListener("pointerup", finishGesture);
canvas.addEventListener("pointercancel", cancelGesture);
