import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PaymentModalProps {
	isOpen: boolean;
	onClose: () => void;
	amount: number;
	onConfirm: () => void;
	isSubmitting?: boolean;
}

export function PaymentModal({
	isOpen,
	onClose,
	amount,
	onConfirm,
	isSubmitting,
}: PaymentModalProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [copied, setCopied] = useState(false);
	const walletAddress =
		"0x06abbb59fff209c9d09fc32e2690af872582441f72d4560f20b262fe134f7ac6";

	const handleCopy = async () => {
		await navigator.clipboard.writeText(walletAddress);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handlePayment = async () => {
		setIsProcessing(true);
		// Simulate payment processing
		// await new Promise(resolve => setTimeout(resolve, 1500))
		setIsProcessing(false);
		onConfirm();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-[#1C1C1C] border-gray-800 text-white sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Send Payment</DialogTitle>
					<DialogDescription className="text-gray-400">
						Please send {amount} ETH to complete your case
						submission
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					{/* QR Code */}
					<div className="flex justify-center">
						<div className="bg-white p-4 rounded-lg">
							<QRCodeSVG
								value={`ethereum:${walletAddress}?amount=${amount}`}
								size={200}
								bgColor="#ffffff"
								fgColor="#000000"
								level="L"
								includeMargin={false}
							/>
						</div>
					</div>

					{/* Wallet Address */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-200">
							Send to this address
						</label>
						<div className="flex gap-2">
							<Input
								readOnly
								value={walletAddress}
								className="bg-[#2C2C2C] border-gray-700 text-white font-mono"
							/>
							<Button
								variant="outline"
								size="icon"
								onClick={handleCopy}
								className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
							>
								{copied ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>

					{/* Amount Details */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm text-gray-200">
							<span>Amount to Send</span>
							<span>{amount} ETH</span>
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<Button
						variant="outline"
						onClick={onClose}
						className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
					>
						Cancel
					</Button>
					<Button
						onClick={handlePayment}
						disabled={isProcessing || isSubmitting}
						className="bg-white text-black hover:bg-gray-200"
					>
						{isProcessing || isSubmitting
							? "Confirming..."
							: "Confirm Payment"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
