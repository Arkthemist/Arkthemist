'use client';

import { ContractsInterface, useStarkContract } from '@/contracts/contractsInterface';
import { useAuth } from "@/contexts/auth-context";
import { Button } from '@/components/ui/button';

interface PayWithStarkProps {
    text?: string
    onClick?: () => void;
    disabled?: boolean
}

export default function PayWithStark({ text, onClick, disabled }: PayWithStarkProps) {
    const { account, wallet } = useAuth();

    const contracts = new ContractsInterface(wallet, useStarkContract());
    const handleOnClick = async () => {
        const resultPay = await contracts.pay(0.15, '0x0040a7eed70db97a848bb1016164c57db84e4237a8fafdd958033cda091a4fcb');

        console.log('resultPay', resultPay)

        if (resultPay) {
            onClick && onClick();
        }
    }

    return (
        <div className="flex items-center gap-4">
            {/* <button onClick={handleOnClick}>
                Pay with stark
            </button> */}

            <Button onClick={handleOnClick} disabled={disabled}>
                {text ?? 'Submit'}
            </Button>
        </div>
    );
}
