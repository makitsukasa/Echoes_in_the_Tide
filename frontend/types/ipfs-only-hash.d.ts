declare module 'ipfs-only-hash' {
  export function of(
    data: Buffer | Uint8Array,
    options?: { cidVersion?: number }
  ): Promise<string>;
}
