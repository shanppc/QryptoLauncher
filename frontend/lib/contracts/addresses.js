// chainId -> contract addresses
// Adding a new chain = add an entry here + add the chain in lib/chains.js
export const addresses = {
  11155111: {
    ERC20_FACTORY: "0xd809A03876fe8c10f1dB5FD0bf0C80B4eD873389",
    ERC721_FACTORY: "0x895C7F82587c63942a973bf1e4c3a998aF1040f3",
  },
};

export function getAddresses(chainId) {
  return addresses[chainId];
}
