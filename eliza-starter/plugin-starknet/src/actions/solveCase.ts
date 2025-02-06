import {
	type Action,
	ActionExample,
	composeContext,
	elizaLogger,
	generateObjectDeprecated,
	HandlerCallback,
	IAgentRuntime,
	Memory,
	ModelClass,
	State,
} from "@elizaos/core";
import { Percent } from "@uniswap/sdk-core";
import {
	getStarknetAccount,
	getStarknetProvider,
	parseFormatedAmount,
	parseFormatedPercentage,
} from "../utils/index.ts";
import { DeployData, Factory } from "@unruggable_starknet/core";
import { AMM, QUOTE_TOKEN_SYMBOL } from "@unruggable_starknet/core/constants";
import { ACCOUNTS, TOKENS } from "../utils/constants.ts";
import { validateStarknetConfig } from "../environment.ts";
import { shortString } from "starknet";

export function convertToDeployData(content: any): DeployData | null {
	const name =
		content["Token Name"] ||
		content["tokenName"] ||
		content["tokenname"] ||
		content["name"] ||
		content["token_name"];
	const symbol =
		content["Token Symbol"] ||
		content["tokenSymbol"] ||
		content["tokensymbol"] ||
		content["symbol"] ||
		content["token_symbol"];
	const owner =
		content["Token Owner"] ||
		content["tokenOwner"] ||
		content["tokenowner"] ||
		content["owner"] ||
		content["token_owner"];
	const initialSupply =
		content["Token Initial Supply"] ||
		content["tokenInitialSupply"] ||
		content["tokeninitialsupply"] ||
		content["initialSupply"] ||
		content["token_initial_supply"];

	if (
		typeof name === "string" &&
		typeof symbol === "string" &&
		typeof owner === "string" &&
		typeof initialSupply === "string"
	) {
		return {
			name,
			symbol,
			owner,
			initialSupply,
		};
	}

	return null;
}

export function isDeployTokenContent(
	content: DeployData,
): content is DeployData {
	const deployData = convertToDeployData(content);
	if (!deployData) {
		return false;
	}

	// Validate addresses (must be 32-bytes long with 0x prefix)
	const validAddresses =
		deployData.name.length > 2 &&
		deployData.symbol.length > 2 &&
		parseInt(deployData.initialSupply) > 0 &&
		deployData.owner.startsWith("0x") &&
		deployData.owner.length === 66;

	return validAddresses;
}

const deployTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "parties": {
        "Party A": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "Party B": "0x0000000000000000000000000000000000000000000000000000000000000000"
    },
    "winner": "Party A",
    "orderId": 1
}
\`\`\`

{{recentMessages}}

Analyze the case based on the provided description and reason using Costa Rica law to determine which party has the right to the money. Extract the following information:

A dictionary of parties involved, with keys as party names and values as their addresses.
The winner of the case, which is the party entitled to the money based on your reasoning. If no conclusion can be made due to insufficient information, return "winner": "unknown".
The orderId number of the case.

Important:

Ensure the decision in the JSON block matches your reasoning in the response. If you indicate that more information is needed, or you need any additional details, information, the JSON must set "winner": "unknown".

Be very strict with the laws of Costa Rica and the information provided in the description. If the information is not sufficient to make a decision, set "winner": "unknown".

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.`;

export const solveCase: Action = {
	name: "RESOLVE_CASE",
	similes: ["RESOLVE_CASE", "SOLVE_CASE"],
	validate: async (runtime: IAgentRuntime, _message: Memory) => {
		await validateStarknetConfig(runtime);
		return true;
	},
	description:
		"Solve a case based on the provided description and reason using Costa Rica law to determine which party has the right to the money.",
	handler: async (
		runtime: IAgentRuntime,
		message: Memory,
		state: State,
		_options: { [key: string]: unknown },
		callback?: HandlerCallback,
	): Promise<boolean> => {
		elizaLogger.log("Starting SOLVE_CASE handler...");
		if (!state) {
			state = (await runtime.composeState(message)) as State;
		} else {
			state = await runtime.updateRecentMessageState(state);
		}

		const deployContext = composeContext({
			state,
			template: deployTemplate,
		});

		const response = await generateObjectDeprecated({
			runtime,
			context: deployContext,
			modelClass: ModelClass.SMALL,
		});

		elizaLogger.log(JSON.stringify(response, null, 2));

		if (response.winner === "unknown") {
			callback?.({
				text: "More information is needed to make a decision.",
			});
			return false;
		}

		callback?.({
			text: `The winner party is ${response.winner}. Sending funds...`,
		});

		try {
			const account = getStarknetAccount(runtime);

			let txPayload = [
				{
					contractAddress:
						"0x07b035dde3e86294d972e1ed8520c39222e72b780ce31202a5497235e2c6b8e3",
					entrypoint: "complete_order",
					calldata: [
						response.orderId,
						"0x0",
						shortString.encodeShortString(response.winner),
					],
				},
			];

			const tx = await account.execute(txPayload);
			elizaLogger.log("Transaction hash is: ", tx);

			callback?.({
				text:
					"Order completed successfully! Deployed in tx: " +
					tx.transaction_hash,
			});

			return true;
		} catch (error) {
			elizaLogger.error("Error while completing the order:", error);
			if (error.baseError.message === "Transaction execution error") {
				callback?.({
					text: "Transaction execution error: did you pay the order?",
					content: {
						error: "Transaction execution error: did you pay the order?",
					},
				});
				return false;
			}
			callback?.({
				text: `Error while completing the order: ${error.message}`,
				content: { error: error.message },
			});
			return false;
		}
	},
	examples: [
		[
			{
				user: "{{user1}}",
				content: {
					text: "Party A, residing at 123 Main St, San José, Costa Rica, claims that Party B, residing at 456 Elm St, Cartago, Costa Rica, owes them $5,000 for services rendered. Party B argues that the services were never completed. Decide who has the right to the money.",
				},
			},
			{
				user: "{{agent}}",
				content: {
					text: 'Based on Costa Rica law, and after analyzing the arguments, Party A is entitled to the money. Here is the extracted decision:\n\n```json\n{\n    "parties": {\n        "Party A": "123 Main St, San José, Costa Rica",\n        "Party B": "456 Elm St, Cartago, Costa Rica"\n    },\n    "winner": "Party A"\n}\n```',
				},
			},
		],
		[
			{
				user: "{{user1}}",
				content: {
					text: "Party X at 789 Pine St, Heredia, Costa Rica, and Party Y at 321 Oak St, Alajuela, Costa Rica, are in a dispute over $2,000. Party X claims they lent the money, but Party Y denies receiving it. Decide who has the right to the money.",
				},
			},
			{
				user: "{{agent}}",
				content: {
					text: 'After evaluating the case using Costa Rica law, Party Y is found to have the stronger claim. Here is the decision:\n\n```json\n{\n    "parties": {\n        "Party X": "789 Pine St, Heredia, Costa Rica",\n        "Party Y": "321 Oak St, Alajuela, Costa Rica"\n    },\n    "winner": "Party Y"\n}\n```',
				},
			},
		],
		[
			{
				user: "{{user1}}",
				content: {
					text: "Party M at 654 Cedar Ave, Limón, Costa Rica, and Party N at 987 Birch Rd, Guanacaste, Costa Rica, are disputing $10,000. Party M argues it was an agreed payment for delivered goods, while Party N says the goods were defective and the payment should be returned. Please decide.",
				},
			},
			{
				user: "{{agent}}",
				content: {
					text: 'According to Costa Rica law and the provided details, Party N is entitled to the money. Here is the extracted decision:\n\n```json\n{\n    "parties": {\n        "Party M": "654 Cedar Ave, Limón, Costa Rica",\n        "Party N": "987 Birch Rd, Guanacaste, Costa Rica"\n    },\n    "winner": "Party N"\n}\n```',
				},
			},
		],
	] as ActionExample[][],
} as Action;
