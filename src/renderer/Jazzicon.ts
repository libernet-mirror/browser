// Freely adapted from the @metamask/jazzicon module.

import MersenneTwister from "mersenne-twister";
import Color from "color";

const colors = [
  "#01888C", // teal
  "#FC7500", // bright orange
  "#034F5D", // dark teal
  "#F73F01", // orangered
  "#FC1960", // magenta
  "#C7144C", // raspberry
  "#F3C100", // goldenrod
  "#1598F2", // lightning blue
  "#2465E1", // sail blue
  "#F19E02", // gold
];

const shapeCount = 3;

const wobble = 30;

class Generator {
  private readonly _diameter: number;
  private readonly _generator: MersenneTwister;
  private readonly _colors: string[];

  public constructor(address: string, diameter: number) {
    this._diameter = diameter;
    const seed = parseInt(address.toLowerCase().slice(2, 10), 16);
    this._generator = new MersenneTwister(seed);
    this._colors = this._hueShift();
  }

  private _hueShift(): string[] {
    const amount = this._generator.random() * 30 - wobble / 2;
    return colors.slice().map((hex: string) => {
      const color = Color(hex);
      color.rotate(amount);
      return color.hex();
    });
  }

  private _generateColor(): string {
    this._generator.random(); // skip one because the original code does so
    const index = Math.floor(this._colors.length * this._generator.random());
    return this._colors.splice(index, 1)[0];
  }

  public generate(): string {
    const diameter = this._diameter;
    const center = diameter / 2;
    const canvas = document.createElement("canvas");
    canvas.width = diameter;
    canvas.height = diameter;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const context = canvas.getContext("2d")!;
    context.fillStyle = this._generateColor();
    context.fillRect(0, 0, diameter, diameter);
    for (let i = 0; i < shapeCount; i++) {
      context.save();
      const firstRotation = this._generator.random();
      const angle = Math.PI * 2 * firstRotation;
      const velocity =
        (diameter / shapeCount) * this._generator.random() +
        (i * diameter) / shapeCount;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      const secondRotation = this._generator.random();
      const rotation = (firstRotation * 2 + secondRotation) * Math.PI;
      context.translate(tx + center, ty + center);
      context.rotate(rotation);
      context.translate(-center, -center);
      context.fillStyle = this._generateColor();
      context.fillRect(0, 0, diameter, diameter);
      context.restore();
    }
    return canvas.toDataURL();
  }
}

// Returns the jazzicon PNG image generated from the specified address as a data URL.
export function jazzicon(address: string, diameter = 100): string {
  return new Generator(address, diameter).generate();
}
