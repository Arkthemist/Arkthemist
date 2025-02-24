import type { Abi } from "starknet";
import { Contract } from "starknet";
import { provider } from "../utils/constants";
import configExternalContracts from "../contracts/configExternalContracts";

type CoinGeckoResponse = {
	starknet: {
		usd: number;
	};
};

const useStarkContract = () => {
	const env = (process.env.NEXT_PUBLIC_STARKNET_ENV ??
		"sepolia") as keyof typeof configExternalContracts;
    
    const contract = new Contract(configExternalContracts[env].stark.abi as Abi,
            configExternalContracts[env].stark.address,
            provider,
    );

	return contract as Contract;
};

class ContractsInterface {
	starkContract: Contract | null;
	wallet: any;
    provider: any;

	constructor(
		wallet: any,
		stark: Contract | undefined,
	) {
		this.starkContract = stark ?? null;
		this.wallet = wallet;
		this.provider = provider;
	}

	async getStarkPrice() {
		const MAX_RETRIES = 3;
		const RETRY_DELAY = 1000;
		const FALLBACK_PRICE = 2.5;

		for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
			try {
				const response = await fetch(
					"https://api.coingecko.com/api/v3/simple/price?ids=starknet&vs_currencies=usd",
					{
						headers: {
							Accept: "application/json",
							"Cache-Control": "no-cache",
						},
					},
				);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = (await response.json()) as CoinGeckoResponse;
				if (!data?.starknet?.usd) {
					throw new Error("Invalid response format");
				}

				return data.starknet.usd;
			} catch (error) {
				console.warn(`Attempt ${attempt}/${MAX_RETRIES} failed:`, error);

				if (attempt === MAX_RETRIES) {
					console.warn(
						"All retries failed, using fallback price:",
						FALLBACK_PRICE,
					);
					return FALLBACK_PRICE;
				}

				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
			}
		}

		return FALLBACK_PRICE;
	}

	async pay(amount: number, recipient: string) {
		// connect user account to contracts
		//this.connect_account();

		// get the current stark price in usd to convert the price to starks
		
		const stark_price_usd = await this.getStarkPrice();
		const price = Math.floor(amount / stark_price_usd) * 1000000000000000000;

        if (!this.starkContract) {
			throw new Error("Stark contract is not loaded");
		}
		const call = {
            contract_address: this.starkContract.address,
            entry_point: "transfer",
            calldata: [
                recipient,
                `0x${price.toString(16)}`,
                0x0,
            ],
        };
        let tx = await this.wallet.request({
            type: "wallet_addInvokeTransaction",
            params: {
                calls: [call],
            }
        });
        const txReceipt = await this.provider.waitForTransaction(
            tx.transaction_hash,
            {
                retryInterval: 100,
            },
        );
        if (txReceipt?.isSuccess()) {
            console.log("transfer success");
            return true;
        }
		return true;
	}
}

export {
	ContractsInterface,
	useStarkContract,
};