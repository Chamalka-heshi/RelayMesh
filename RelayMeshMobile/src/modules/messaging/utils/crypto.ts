import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

/**
 * Generates a new Curve25519 public/private key pair for the user.
 * This should be called once when the user first sets up the app.
 */
export const generateKeyPair = () => {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    privateKey: util.encodeBase64(keyPair.secretKey),
  };
};

/**
 * Encrypts a message payload using the sender's private key and the receiver's public key.
 * 
 * @param text The plain text message to encrypt.
 * @param myPrivateKey The sender's Curve25519 private key (Base64).
 * @param theirPublicKey The recipient's Curve25519 public key (Base64).
 * @returns A Base64 string containing the nonce and encrypted ciphertext.
 */
export const encryptMessage = (
  text: string,
  myPrivateKey: string,
  theirPublicKey: string
): string => {
  const secretKeyUint8 = util.decodeBase64(myPrivateKey);
  const publicKeyUint8 = util.decodeBase64(theirPublicKey);
  const messageUint8 = util.decodeUTF8(text);

  // Generate a one-time cryptographic number (nonce) for this specific message
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  // Encrypt the message
  const encryptedBox = nacl.box(
    messageUint8,
    nonce,
    publicKeyUint8,
    secretKeyUint8
  );

  // Combine the nonce and the encrypted message so the receiver can decrypt it
  const fullMessage = new Uint8Array(nonce.length + encryptedBox.length);
  fullMessage.set(nonce);
  fullMessage.set(encryptedBox, nonce.length);

  return util.encodeBase64(fullMessage);
};

/**
 * Decrypts a received message using the receiver's private key and the sender's public key.
 * 
 * @param encryptedPayload The Base64 string from the database/mesh.
 * @param myPrivateKey The receiver's Curve25519 private key (Base64).
 * @param theirPublicKey The sender's Curve25519 public key (Base64).
 * @returns The decrypted plain text string, or null if decryption fails.
 */
export const decryptMessage = (
  encryptedPayload: string,
  myPrivateKey: string,
  theirPublicKey: string
): string | null => {
  try {
    const secretKeyUint8 = util.decodeBase64(myPrivateKey);
    const publicKeyUint8 = util.decodeBase64(theirPublicKey);
    const fullMessageUint8 = util.decodeBase64(encryptedPayload);

    // Extract the nonce and the actual encrypted message box
    const nonce = fullMessageUint8.slice(0, nacl.box.nonceLength);
    const messageBox = fullMessageUint8.slice(nacl.box.nonceLength);

    // Attempt to decrypt
    const decryptedUint8 = nacl.box.open(
      messageBox,
      nonce,
      publicKeyUint8,
      secretKeyUint8
    );

    if (!decryptedUint8) {
      return null; // Decryption failed (wrong keys or tampered data)
    }

    return util.encodeUTF8(decryptedUint8);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};