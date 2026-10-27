import type { DrawingCommand } from "./types.ts";

export function exportImage(
  commands: DrawingCommand[],
  baseWidth: number,
  baseHeight: number,
  scaleFactor: number = 2,
): void {
  //create offscreen canvas
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = baseWidth * scaleFactor;
  exportCanvas.height = baseHeight * scaleFactor;
  const exportCtx = exportCanvas.getContext("2d")!;

  //white background for export
  exportCtx.fillStyle = "#ffffff";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  //scale image mindblown
  exportCtx.scale(scaleFactor, scaleFactor);

  //replay committed commands
  for (const cmd of commands) {
    exportCtx.save();
    cmd.render(exportCtx);
    exportCtx.restore();
  }

  exportCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "drawing.png";
    link.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}
