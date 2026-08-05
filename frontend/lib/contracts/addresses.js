// chainId -> contract addresses
// Adding a new chain = add an entry here + add the chain in lib/chains.js
export const addresses = {
  8453: {
    ERC20_FACTORY: "0x172B0EaDf99c26dc03e4AAF503dE1791c540844a",
    ERC721_FACTORY: "0xc715DEd4f82A9AEe2CD172A9da3431269C750d21",
  },
  11155111: {
    ERC20_FACTORY: "0xd809A03876fe8c10f1dB5FD0bf0C80B4eD873389",
    ERC721_FACTORY: "0x895C7F82587c63942a973bf1e4c3a998aF1040f3",
  },
};

export function getAddresses(chainId) {
  return addresses[chainId];
}
