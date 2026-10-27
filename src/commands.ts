import type { DrawingCommand, Point } from "./types.ts";

// Stroke Class
export class StrokeCommand implements DrawingCommand {
  constructor(
    public points: Point[],
    public lineWidth: number,
    public color: string,
  ) {}
  render(ctx: CanvasRenderingContext2D): void {
    if (this.points.length === 0) return;
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }
}
