'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

export default function FileHandler() {
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    // const [fileName, setFileName] = useState<string>('');

    return (
        <div className="flex items-center gap-4">
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
                        // Store both URL and filename
                        setDownloadUrl(result.info.secure_url);
                        // setFileName(result.info.original_filename);
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
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
                    download={downloadUrl}
                >
                    Download
                </a>
            )}
        </div>
    );
}