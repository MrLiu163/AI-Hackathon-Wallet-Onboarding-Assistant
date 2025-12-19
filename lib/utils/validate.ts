export function isValidTxHash(txHash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(txHash)
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function extractTxHash(text: string): string | null {
  const match = text.match(/0x[a-fA-F0-9]{64}/)
  return match ? match[0] : null
}

export function extractAddress(text: string): string | null {
  const match = text.match(/0x[a-fA-F0-9]{40}/)
  return match ? match[0] : null
}
