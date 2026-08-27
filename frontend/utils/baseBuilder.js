/**
 * ERC-8021 Base Builder Code attribution utility.
 *
 * Implements transaction attribution for the Base Builder program by
 * appending a standardised builder suffix to outgoing deployment bytecode
 * and transaction calldata on Base Mainnet (8453) and Base Sepolia (84532).
 *
 * Builder Code : bc_ytb6dabi
 * ERC-8021 spec: https://github.com/base-org/erc-8021
 */

/** @type {number[]} Chain IDs that require the builder suffix. */
const BASE_CHAIN_IDS = [8453, 84532];

/**
 * The encoded builder-code suffix (hex string, no 0x prefix).
 * Encodes: "bc_ytb6dabi" followed by the ERC-8021 STOP-opcode padding.
 */
export const BASE_BUILDER_SUFFIX =
  "62635f79746236646162690b0080218021802180218021802180218021";

/**
 * Appends the ERC-8021 builder suffix to a hex payload (calldata or bytecode)
 * when the transaction is destined for a Base chain.
 *
 * @param {string} payload  - Hex string with or without a leading "0x" prefix.
 * @param {number} chainId  - The EVM chain ID of the target network.
 * @returns {string}        - The (possibly extended) hex payload with "0x" prefix.
 */
export function appendBuilderSuffix(payload, chainId) {
  // Normalise input – strip leading "0x" / "0X" if present.
  const stripped =
    typeof payload === "string" && payload.toLowerCase().startsWith("0x")
      ? payload.slice(2)
      : payload ?? "";

  // Only apply the suffix on supported Base chains.
  if (!BASE_CHAIN_IDS.includes(chainId)) {
    return `0x${stripped}`;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[Base Builder] Appended suffix for code 'bc_ytb6dabi' on chain ${chainId}`
    );
  }

  return `0x${stripped}${BASE_BUILDER_SUFFIX}`;
}
