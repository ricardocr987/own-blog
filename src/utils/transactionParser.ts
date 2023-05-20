import { PartiallyDecodedInstruction } from "@solana/web3.js"
import { InstructionType, IX_ACCOUNTS_LAYOUT, IX_METHOD_CODE } from "./solita"

export function getInstructionType(data: Buffer): InstructionType | undefined {
    const discriminator = data.slice(0, 8)
    return IX_METHOD_CODE.get(discriminator.toString('ascii'))
}

export function parseInstructionAccounts(
    type: InstructionType,
    rawIx: PartiallyDecodedInstruction,
): any | null {
    const info: any = {}

    const template = IX_ACCOUNTS_LAYOUT[type]
    if (!template) return null

    for (const [index, name] of IX_ACCOUNTS_LAYOUT[type].entries()) {
        info[name] = rawIx.accounts[index]
    }

    return info
}