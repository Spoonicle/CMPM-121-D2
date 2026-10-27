import { StrokeCommand } from "./commands.ts";
import type { DrawingCommand, Point } from "./types.ts";

const app = document.querySelector<HTMLElement>("#app")!;

// Create our UI
const heading = document.createElement("h1");
heading.textContent = "D2 project";

const message = document.createElement("p");
message.textContent = "Your project starts here.";

// Create our Toolbar
const toolbar = document.createElement("div");
toolbar.style.marginBottom = "8px";
toolbar.id = "toolbar";

// Create our Redraw Button
const redrawBtn = document.createElement("button");
redrawBtn.textContent = "Redraw";
toolbar.append(redrawBtn);

// Create our Canvas
const canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 400;
canvas.style.border = "1px solid #ccc";
canvas.style.display = "block";
canvas.style.cursor = "crosshair";

app.append(heading, message, toolbar, canvas);

const ctx = canvas.getContext("2d")!;

const documentCommands: DrawingCommand[] = [];

let currentPoints: Point[] | null = null;

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const cmd of documentCommands) {
    cmd.render(ctx);
  }

  if (currentPoints && currentPoints.length > 0) {
    const tempStroke = new StrokeCommand(currentPoints, 2, "#000000");
    tempStroke.render(ctx);
  }
}

redrawBtn.addEventListener("click", () => {
  redraw();
});

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

function finishGesture() {
  if (currentPoints && currentPoints.length > 0) {
    documentCommands.push(new StrokeCommand(currentPoints, 2, "#000000"));
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
