export const AR_LIST = ["1:1", "3:2", "2:3", "16:9", "9:16", "21:9"] as const;

export function clamp(min: number, max: number, val: number): number {
  return Math.min(max, Math.max(min, val));
}








