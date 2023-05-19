import crypto from 'crypto'

// Encrypt data
export function encryptData(data: string) {
  if (!process.env.SECRET_KEY || !process.env.SECRET_IV || !process.env.ECNRYPTION_METHOD) throw new Error('secretKey, secretIV, and ecnryptionMethod are required')
  // Generate secret hash with crypto to use for encryption
  const key = crypto
    .createHash('sha512')
    .update(process.env.SECRET_KEY)
    .digest('hex')
    .substring(0, 32)
  const encryptionIV = crypto
    .createHash('sha512')
    .update(process.env.SECRET_IV)
    .digest('hex')
    .substring(0, 16)
  const cipher = crypto.createCipheriv(process.env.ECNRYPTION_METHOD || '', key, encryptionIV)
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64') // Encrypts data and converts to hex and base64
}

// Decrypt data
export function decryptData(encryptedData: string) {
  if (!process.env.SECRET_KEY || !process.env.SECRET_IV || !process.env.ECNRYPTION_METHOD) throw new Error('secretKey, secretIV, and ecnryptionMethod are required')
  // Generate secret hash with crypto to use for encryption
  const key = crypto
    .createHash('sha512')
    .update(process.env.SECRET_KEY)
    .digest('hex')
    .substring(0, 32)
  const encryptionIV = crypto
    .createHash('sha512')
    .update(process.env.SECRET_IV)
    .digest('hex')
    .substring(0, 16)
  const buff = Buffer.from(encryptedData, 'base64')
  const decipher = crypto.createDecipheriv(process.env.ECNRYPTION_METHOD, key, encryptionIV)
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  ) // Decrypts data and converts to utf8
}