import { BaseError, ContractFunctionRevertedError, UserRejectedRequestError } from "viem";

// Custom errors declared in Erc20Factory.sol / ERC721Factory.sol
const ERROR_MESSAGES = {
  InsufficientPayment: "Payment sent was lower than the deployment fee.",
  InvalidNameOrSymbol: "Name and symbol are required.",
  ZeroAmount: "Initial supply must be greater than zero.",
  InvalidBaseURI: "Metadata URI is missing or invalid.",
  MaxSupplyReached: "Max supply has already been reached.",
  Unauthorized: "You are not authorized to perform this action.",
  unAuthorized: "You are not authorized to perform this action.",
  WithdrawFailed: "Withdrawal failed.",
};

/**
 * Turn a viem/wagmi error into a readable message.
 * Decodes contract custom errors instead of showing raw revert data.
 */
export function parseContractError(err) {
  if (!err) return "";

  if (err instanceof BaseError) {
    const rejected = err.walk((e) => e instanceof UserRejectedRequestError);
    if (rejected) return "Transaction rejected in wallet.";

    const reverted = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (reverted instanceof ContractFunctionRevertedError) {
      const name = reverted.data?.errorName;
      if (name) return ERROR_MESSAGES[name] ?? `Transaction reverted: ${name}`;
      if (reverted.reason) return reverted.reason;
    }

    if (/insufficient funds/i.test(err.message)) {
      return "Insufficient ETH balance to cover the fee and gas.";
    }

    return err.shortMessage || err.message;
  }

  // Non-viem errors (IPFS upload, network, etc.)
  return err.message || "Something went wrong.";
}
