export function convertToSol(lamports: number): number {
    return parseFloat((lamports / 1000000000).toFixed(9));
}

export function convertToLamports(sol: number): number {
    return Math.floor(sol * 1000000000);
}  