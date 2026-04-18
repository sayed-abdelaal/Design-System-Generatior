declare module "culori" {
  export type OklchColor = {
    mode: "oklch";
    l: number;
    c: number;
    h?: number;
  };

  export function converter(mode: "oklch"): (input: unknown) => OklchColor | undefined;
  export function formatHex(input: string | OklchColor): string;
  export function inGamut(mode: "rgb"): (input: OklchColor) => boolean;
  export function parse(input: string): unknown;
}
