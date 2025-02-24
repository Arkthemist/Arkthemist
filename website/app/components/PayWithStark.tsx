'use client';

import { ContractsInterface, useStarkContract } from '@/contracts/contractsInterface';
import { useAuth } from "@/contexts/auth-context";

export default function PayWithStark() {
    const { account, wallet } = useAuth();

    const contracts = new ContractsInterface(wallet, useStarkContract());
    const handleOnClick = async () => {
        contracts.pay(1, '0x0040a7eed70db97a848bb1016164c57db84e4237a8fafdd958033cda091a4fcb');
    }

    return (
        <div className="flex items-center gap-4">
            <button onClick={handleOnClick}>
                Pay with stark
            </button>
        </div>
    );
}
