export function convertToSol(lamports: number): number {
    return parseFloat((lamports / 1000000000).toFixed(9));
}