import CryptoJS from "crypto-js";

// ストレージキー定義
const ENCRYPTED_KEY = "encryptedFilebaseKey";
const ENCRYPTED_SECRET = "encryptedFilebaseSecret";
const SESSION_KEY = "sessionFilebaseKey";
const SESSION_SECRET = "sessionFilebaseSecret";

// EIP-712 用の型定義
const domain = {
  name: 'Echoes in the Tide',
  version: '1',
  chainId: 80002,
  verifyingContract: '0x0000000000000000000000000000000000000000'
};

const types = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
  ],
  Auth: [
    { name: 'purpose', type: 'string' },
    { name: 'timestamp', type: 'uint256' }
  ]
};

// ウォレットが利用可能かチェック
function isWalletAvailable(): boolean {
  return typeof window !== 'undefined' && 'ethereum' in window;
}

// 鍵を署名から導出
async function deriveKeyFromTypedSignature(): Promise<string> {
  if (!isWalletAvailable()) {
    throw new Error('ウォレットが利用できません');
  }

  const ethereum = window.ethereum!;
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
  const account = accounts[0];

  const message = {
    purpose: "Decrypt Filebase credentials",
    timestamp: Math.floor(Date.now() / 1000)
  };

  const msgParams = JSON.stringify({
    domain,
    types,
    primaryType: "Auth",
    message
  });

  const signature = await ethereum.request({
    method: "eth_signTypedData_v4",
    params: [account, msgParams]
  }) as string;

  return CryptoJS.SHA256(signature).toString();
}

// 初回保存
export async function saveEncryptedCredentials(key: string, secret: string) {
  const encryptionKey = await deriveKeyFromTypedSignature();
  const encryptedKey = CryptoJS.AES.encrypt(key, encryptionKey).toString();
  const encryptedSecret = CryptoJS.AES.encrypt(secret, encryptionKey).toString();

  localStorage.setItem(ENCRYPTED_KEY, encryptedKey);
  localStorage.setItem(ENCRYPTED_SECRET, encryptedSecret);
  sessionStorage.setItem(ENCRYPTED_KEY, encryptedKey);
  sessionStorage.setItem(ENCRYPTED_SECRET, encryptedSecret);
}

// 復号してセッションストレージに保存
export async function decryptAndStoreCredentialsInSession(): Promise<{ key: string; secret: string } | null> {
  const encryptedKey = localStorage.getItem(ENCRYPTED_KEY);
  const encryptedSecret = localStorage.getItem(ENCRYPTED_SECRET);

  if (!encryptedKey || !encryptedSecret) {
    return null;
  }

  const encryptionKey = await deriveKeyFromTypedSignature();

  try {
    const decryptedKey = CryptoJS.AES.decrypt(encryptedKey, encryptionKey);
    const decryptedSecret = CryptoJS.AES.decrypt(encryptedSecret, encryptionKey);

    const key = decryptedKey.toString(CryptoJS.enc.Utf8);
    const secret = decryptedSecret.toString(CryptoJS.enc.Utf8);

    if (!key || !secret) throw new Error("復号失敗");

    sessionStorage.setItem(SESSION_KEY, key);
    sessionStorage.setItem(SESSION_SECRET, secret);

    return { key, secret };
  } catch {
    return null;
  }
}

// セッションストレージから取得
export function getCredentialsFromSession(): { key: string; secret: string } | null {
  const key = sessionStorage.getItem(SESSION_KEY);
  const secret = sessionStorage.getItem(SESSION_SECRET);

  if (!key || !secret) return null;

  return { key, secret };
}
