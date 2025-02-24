'use client';

import { signDocument } from '@/utils/signWithStarknet';
import { useAuth } from "@/contexts/auth-context";

export default function SignDocument() {
    const { account, wallet } = useAuth();
    const handleOnClick = async () => {
        let documentUrl = 'https://res.cloudinary.com/dyurooq5e/raw/upload/v1740360418/Jonatan-chaverri_r7bmw0.pdf';
        const result = await signDocument(documentUrl, account, wallet);
        console.log('Document signed successfully:', result);
    }

    return (
        <div className="flex items-center gap-4">
            <button onClick={handleOnClick}>
                Sign document
            </button>
        </div>
    );
}
