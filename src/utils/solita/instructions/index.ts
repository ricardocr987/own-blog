import { AccountMeta, PublicKey } from '@solana/web3.js'

export * from './buyToken'
export * from './createApp'
export * from './createToken'
export * from './deletetoken'
export * from './editTokenPrice'
export * from './refund'
export * from './shareToken'
export * from './useToken'
export * from './withdrawFunds'

export const CreateAppAccounts = ['systemProgram', 'rent', 'authority', 'app']

export type CreateTokenInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const CreateTokenAccounts = [
  'metadataProgram',
  'messagesProgram',
  'systemProgram',
  'tokenProgram',
  'rent',
  'authority',
  'app',
  'tokenMint',
  'token',
  'acceptedMint',
  'tokenMetadata',
]

export type EditTokenPriceInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const EditTokenPriceAccounts = ['authority', 'token']

export type BuyTokenInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const BuyTokenAccounts = [
  'systemProgram',
  'tokenProgram',
  'associatedTokenProgram',
  'rent',
  'clock',
  'authority',
  'token',
  'tokenMint',
  'buyerTransferVault',
  'acceptedMint',
  'payment',
  'paymentVault',
  'buyerTokenVault',
]

export type ShareTokenInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const ShareTokenAccounts = [
  'systemProgram',
  'tokenProgram',
  'associatedTokenProgram',
  'rent',
  'authority',
  'token',
  'tokenMint',
  'receiver',
  'receiverVault',
]

export type WithdrawFundsInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const WithdrawFundsAccounts = [
  'tokenProgram',
  'authority',
  'app',
  'appCreatorVault',
  'token',
  'tokenMint',
  'receiverVault',
  'buyer',
  'payment',
  'paymentVault',
]

export type RefundInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const RefundAccounts = [
  'tokenProgram',
  'authority',
  'token',
  'tokenMint',
  'receiverVault',
  'payment',
  'paymentVault',
  'buyerTokenVault',
]

export type UseTokenInstruction = {
  programId: PublicKey
  keys: AccountMeta[]
  data: Buffer
}

export const UseTokenAccounts = [
  'systemProgram',
  'tokenProgram',
  'associatedTokenProgram',
  'rent',
  'authority',
  'token',
  'tokenMint',
  'buyerTokenVault',
]