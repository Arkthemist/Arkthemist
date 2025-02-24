import { type TypedData, shortString, hash } from "starknet";
import {
	CHAIN_ID,
	DOMAIN_NAME,
} from "./constants";

export function stringToTwoFelt(str: string) {
    const arrStr = shortString.splitLongString(str);
    const x = shortString.encodeShortString(arrStr[0]);
    const y = shortString.encodeShortString(arrStr[1]);
    return { x, y };
}

export const createMessageStructure = (message: string): TypedData => {
    return {
        domain: {
            chainId: shortString.encodeShortString(CHAIN_ID),
            name: shortString.encodeShortString(DOMAIN_NAME),
            version: "1",
        },
        message: {
            message: message
        },
        primaryType: "Message",
        types: {
            Message: [{ name: "message", type: "felt" }],
            StarkNetDomain: [
                { name: "name", type: "felt" },
                { name: "version", type: "felt" },
                { name: "chainId", type: "felt" },
            ],
        },
    }
};

export const signDocument = async (documentUrl: any, account:any, wallet:any) => {
    if (!account || !wallet) {
        console.log("Account or wallet not found");
        return;
    }
    try {
        // Fetch the document content
        const response = await fetch(documentUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch document");
        }
        const documentText = await response.text();

        // Hash the document content using SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(documentText);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const documentHash = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
        let message_array = stringToTwoFelt(documentHash);
        const poseidonHash = hash.computePoseidonHash(message_array.x, message_array.y);
        const messageStructure = createMessageStructure(poseidonHash);
        const signature = await wallet.request({
            type: "wallet_signTypedData",
            params: messageStructure
        });
        let wallet_hash = await account.hashMessage(messageStructure);

        return await account.verifyMessageInStarknet(wallet_hash, signature, account.address);
    } catch (error) {
        console.error("Error signing document:", error);
        return false;
    }
};
