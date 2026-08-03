import Erc20FactoryAbi from "./abis/Erc20Factory.json";
import Erc20TokenAbi from "./abis/ERC20Token.json";
import Erc721FactoryAbi from "./abis/ERC721Factory.json";
import Erc721TokenAbi from "./abis/ERC721Token.json";
import { getAddresses } from "./addresses";

export {
  Erc20FactoryAbi,
  Erc20TokenAbi,
  Erc721FactoryAbi,
  Erc721TokenAbi,
  getAddresses,
};

export function erc20Factory(chainId) {
  const a = getAddresses(chainId);
  return a ? { address: a.ERC20_FACTORY, abi: Erc20FactoryAbi } : undefined;
}

export function erc721Factory(chainId) {
  const a = getAddresses(chainId);
  return a ? { address: a.ERC721_FACTORY, abi: Erc721FactoryAbi } : undefined;
}
