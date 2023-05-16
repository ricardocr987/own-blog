import { BRICK_PROGRAM_ID_PK } from "@/constants"
import { PublicKey, Connection } from "@solana/web3.js"
import bs58 from "bs58"
import { PaymentArgs, ACCOUNT_DISCRIMINATOR, ACCOUNTS_DATA_LAYOUT, AccountType } from "./solita"

export async function getWithdrawals(publicKey: PublicKey, connection: Connection) {
    const availableWithdrawals: (PaymentArgs & { pubkey: PublicKey })[] = [];
    const paymentAccounts = await connection.getProgramAccounts(
        BRICK_PROGRAM_ID_PK,
        {
            filters: [
                {
                    memcmp: {
                        bytes: bs58.encode(ACCOUNT_DISCRIMINATOR[AccountType.Payment]),
                        offset: 0,
                    },
                },
                {
                    memcmp: {
                        bytes: publicKey.toString(),
                        offset: 104, // authority offset, to get tokens this user is selling
                    },
                },
            ],
        },
    );

    const actualTimestamp = Math.floor(Date.now() / 1000);
    paymentAccounts.map((payment) => {
        try {
            const decodedPayment: PaymentArgs = ACCOUNTS_DATA_LAYOUT[AccountType.Payment].deserialize(payment.account.data)[0];

            if (Number(decodedPayment.refundConsumedAt).toString().length < 13 && Number(decodedPayment.refundConsumedAt) < actualTimestamp) {
                availableWithdrawals.push({ pubkey: payment.pubkey, ...decodedPayment });
            }
        } catch(e) {
            console.log(e);
        }
    });

    return availableWithdrawals.length > 0 ? availableWithdrawals : undefined;
}
