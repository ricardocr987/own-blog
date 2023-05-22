import { Metaplex, Sft } from "@metaplex-foundation/js"
import { PublicKey, Connection } from "@solana/web3.js"
import { METADATA_PROGRAM_ID_PK, BRICK_PROGRAM_ID_PK } from "@/constants";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { TokenInfo } from "@/types";

export async function getMetadatas(publicKey: PublicKey, connection: Connection): Promise<Sft[]> {
    const metaplex = new Metaplex(connection);
    const walletTokens = await connection.getTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID }, );
    const metadatas = await Promise.all(walletTokens.value.map(async (tokenAccount) => {
        try {
            const accountInfo = await connection.getAccountInfo(tokenAccount.pubkey);
            if (accountInfo && accountInfo.data) {
                const accountData = AccountLayout.decode(accountInfo.data);
                const metadataPubkey = getMetadataPubkey(accountData.mint);
                try {
                    await connection.getAccountInfo(metadataPubkey);
                    return await metaplex.nfts().findByMint({ mintAddress: accountData.mint }) as Sft;
                } catch {
                    console.log('token without metadata account')
                }
            } else {
                console.log('accountInfo or its data is undefined');
            }
        } catch (e) {
            console.log(e);
        }
    })).then((results) => results.filter(Boolean)) as Sft[];

    return metadatas;
}

export async function getTokenInfo(publicKey: PublicKey, connection: Connection): Promise<TokenInfo[]>{
    const metadatas = await getMetadatas(publicKey, connection);
    return metadatas.length === 0 ? 
        [{ name: 'Lotus Gang', image: 'https://bafybeiee2xims7znx6wclxd6htztj2i6bztv4wqbucbynmq43caxrtxuxe.ipfs.nftstorage.link/4635.png?ext=png' }] 
    : 
        metadatas.map(metadata => {
            const { name, image } = metadata?.json || {};
            return { name, image };
        }).filter(token => token.image && token.image.includes("arweave")) as { name: string, image: string }[];
}


export function getAppPubkey(appName: string) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("app", "utf-8"), Buffer.from(appName, "utf-8")],
        BRICK_PROGRAM_ID_PK,
    )[0]
}

export function getTokenPubkey(tokenMint: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("token", "utf-8"), tokenMint.toBuffer()],
        BRICK_PROGRAM_ID_PK,
    )[0]
}

export function getPaymentPubkey(tokenMint: PublicKey, publicKey: PublicKey, buyTimestamp: Buffer) {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("payment", "utf-8"),
            tokenMint.toBuffer(),
            publicKey.toBuffer(),
            buyTimestamp,
        ],
        BRICK_PROGRAM_ID_PK,
    )[0]
}

export function getPaymentVaultPubkey(paymentPublicKey: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("payment_vault", "utf-8"), paymentPublicKey.toBuffer()],
        BRICK_PROGRAM_ID_PK,
    )[0]
}

export function getTokenMintPubkey(offChainId: string) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("token_mint", "utf-8"), Buffer.from(offChainId, "utf-8")],
        BRICK_PROGRAM_ID_PK,
    )[0]
}

export function getMetadataPubkey(tokenMint: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata", "utf-8"), 
            METADATA_PROGRAM_ID_PK.toBuffer(),
            tokenMint.toBuffer()
        ], 
        METADATA_PROGRAM_ID_PK,
    )[0]
}