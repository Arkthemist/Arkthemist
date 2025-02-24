'use client';

import { signDocument } from '@/utils/signWithStarknet';
import { useAuth } from "@/contexts/auth-context";
import { Button } from '@/components/ui/button';

interface SignDocumentProps {
    onClick?: () => void;
}

export default function SignDocument({ onClick }: SignDocumentProps) {
    const { account, wallet } = useAuth();
    const handleOnClick = async () => {
        let documentUrl = 'https://res.cloudinary.com/dyurooq5e/raw/upload/v1740360418/Jonatan-chaverri_r7bmw0.pdf';
        const result = await signDocument(documentUrl, account, wallet);
        console.log('Document signed successfully:', result);
        if (result) {
            onClick && onClick();
        }
    }

    return (
        <div className="flex items-center gap-4">
            {/* <button onClick={handleOnClick}>
                Complete & Sign
            </button> */}
            <Button onClick={() => { handleOnClick(); }}>Complete & Send for Signature</Button>
        </div>
    );
}
