function pendulumObject(ctx: CanvasRenderingContext2D, time: number) {
  //line
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 190);
  ctx.closePath();
  ctx.strokeStyle = '#a29376';
  ctx.stroke();

  //circle 01
  ctx.beginPath();
  ctx.arc(0, 225, 35, 0, Math.PI);
  ctx.fillStyle = '#828386';
  ctx.fill();

  //circle 02
  ctx.beginPath();
  ctx.arc(0, 225, 35, Math.PI, 0);
  ctx.fillStyle = '#939598';
  ctx.fill();

  //ellipse
  ctx.beginPath();
  ctx.bezierCurveTo(-35, 224, 0, 249, 35, 224);
  ctx.fill();

  //circle 03
  ctx.beginPath();
  ctx.arc(15 + 5 * sint(time), 210, 7, 0, 2 * Math.PI);
  ctx.fillStyle = '#c3c5c9';
  ctx.fill();
}

const rotate = Math.PI / 180;
const maxRotate = 25 * rotate;
const FREQUENCY = 0.6; //swings per second

function sint(time: number) {
  return Math.sin(FREQUENCY * time * Math.PI * 0.002); // 0.002 allow time in ms
}

export function draw(element: HTMLCanvasElement, time: number = performance.now()) {
  const ctx = element.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas 2d context');
  }

  ctx.setTransform(1, 0, 0, 1, element.width * 0.5, 0);
  ctx.clearRect(-element.width * 0.5, 0, element.width, element.height);
  ctx.rotate(sint(time) * maxRotate);

  pendulumObject(ctx, time);
}
