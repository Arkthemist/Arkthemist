'use client';

import { useAuth } from '@/contexts/auth-context';
import { CldUploadWidget } from 'next-cloudinary';
import { useState, useEffect } from 'react';

interface FileHandlerProps {
    documentId?: string
}

export default function FileHandler({ documentId }: FileHandlerProps) {
    const { isLoggedIn, user } = useAuth();
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    // const [formId, setFormId] = useState<string>('');

    const updateDocumentUrl = async (url: string) => {
        try {
            const response = await fetch('/api/forms', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'user-type': 'client',
                    'user-id': user?.walletAddress ?? ''
                },
                body: JSON.stringify({ id: documentId, documentUrl: url }),
            });

            if (!response.ok) {
                throw new Error('Failed to update document URL');
            }

            const data = await response.json();
            console.log('Document URL updated:', data);
        } catch (error) {
            console.error('Error updating document URL:', error);
        }
    };

    return (
        <div className=" items-center gap-4">
            <CldUploadWidget
                uploadPreset="Arkthemist"
                options={{
                    sources: ['local'],
                    resource_type: 'raw',
                    clientAllowedFormats: ['pdf', 'doc', 'docx'],
                    maxFileSize: 10000000,
                    multiple: false
                }}
                onSuccess={(result: any) => {
                    if (result.info) {
                        console.log('Upload result:', result.info);
                        setDownloadUrl(result.info.secure_url);
                        updateDocumentUrl(result.info.secure_url);
                    }
                }}
                onError={(error: any) => {
                    console.error('Upload error:', error);
                }}
            >
                {({ open }: { open: () => void }) => (
                    <button
                        onClick={() => open()}
                        className="px-4 py-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                    >
                        Upload Document
                    </button>
                )}
            </CldUploadWidget>

            {downloadUrl && (
                <div className="mt-[20px]">
                    <iframe
                        src={downloadUrl}
                        className="w-full h-[500px] rounded-b-lg"
                    />
                </div>
            )}
        </div>
    );
}