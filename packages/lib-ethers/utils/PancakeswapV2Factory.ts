// ref: https://docs.pancakeswap.finance/code/smart-contracts/pancakeswap-exchange/factory-v2
import assert from "assert";

import { Log } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Overrides } from "@ethersproject/contracts";

import { _LiquityContract, _TypedLiquityContract, _TypedLogDescription } from "../src/contracts";
import { log } from "./deploy";

const factoryAbi = [
  "function createPair(address tokenA, address tokenB) returns (address pair)",
  "event PairCreated(address indexed token0, address indexed token1, address pair, uint)"
];

// BSC chain id: 56
// BSC testnet chain id: 97
const factoryAddress = {
  56: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
  97: "0x6725F303b657a9451d8BA641348b6761A6CC7a17"
}

const hasFactory = (chainId: number) => [1, 3, 4, 5, 42, 56, 97].includes(chainId);

interface PancakeswapV2Factory
  extends _TypedLiquityContract<
    unknown,
    { createPair(tokenA: string, tokenB: string, _overrides?: Overrides): Promise<string> }
  > {
  extractEvents(
    logs: Log[],
    name: "PairCreated"
  ): _TypedLogDescription<{ token0: string; token1: string; pair: string }>[];
}

export const createPancakeswapV2Pair = async (
  signer: Signer,
  tokenA: string,
  tokenB: string,
  overrides?: Overrides
): Promise<string> => {
  const chainId = await signer.getChainId();

  if (!hasFactory(chainId)) {
    throw new Error(`PancakeswapV2Factory is not deployed on this network (chainId = ${chainId})`);
  }

  const factory = (new _LiquityContract(
    factoryAddress[chainId as keyof typeof factoryAddress],
    factoryAbi,
    signer
  ) as unknown) as PancakeswapV2Factory;

  log(`Creating Pancakeswap v2 WBNB <=> CUSD pair...`);

  const tx = await factory.createPair(tokenA, tokenB, { ...overrides });
  const receipt = await tx.wait();
  const pairCreatedEvents = factory.extractEvents(receipt.logs, "PairCreated");

  assert(pairCreatedEvents.length === 1);
  return pairCreatedEvents[0].args.pair;
};
