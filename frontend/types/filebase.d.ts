declare module '@filebase/sdk' {
  export class ObjectManager {
    constructor(key: string, secret: string, options: { bucket: string });
    upload(path: string, data: Buffer | Uint8Array, options?: any, metadata?: any): Promise<void>;
    stat(path: string): Promise<any>;
  }
}
