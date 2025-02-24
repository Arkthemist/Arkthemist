import { constants, RpcProvider } from "starknet";

// Network and Chain Configuration
export const CHAIN_ID =
	process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
		? constants.NetworkName.SN_MAIN
		: constants.NetworkName.SN_SEPOLIA;

const NODE_URL =
	process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
		? "https://starknet-mainnet.public.blastapi.io"
		: "https://starknet-sepolia.public.blastapi.io";

const STARKNET_CHAIN_ID =
	process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
		? constants.StarknetChainId.SN_MAIN
		: constants.StarknetChainId.SN_SEPOLIA;

export const provider = new RpcProvider({
	nodeUrl: NODE_URL,
	chainId: STARKNET_CHAIN_ID,
});

// Application Specific Constants
export const DOMAIN_NAME = "Arkthemist";
