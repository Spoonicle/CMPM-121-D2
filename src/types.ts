// Marked places on the canvas use this interface:
export interface DrawingCommand {
  render(ctx: CanvasRenderingContext2D): void;
}

// coordinates
export interface Point {
  x: number;
  y: number;
}
