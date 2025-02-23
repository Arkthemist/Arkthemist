"use client";

import React, { useState, useRef } from "react";
import { Send, ChevronUp, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
}

const ELIZA_API_URL = process.env.NEXT_PUBLIC_ELIZA_API_URL;
const AGENT_ID = "a9e6b80b-7aa5-090a-a403-36c9d676c764";

const ChatWidget = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const handleSendMessage = async () => {
		if (!inputValue.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputValue,
			isUser: true,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsLoading(true);

		try {
			const response = await fetch(
				`${ELIZA_API_URL}/${AGENT_ID}/message`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						text: userMessage.content,
						userId: "1",
						roomId: "1",
						userName: "User",
						unique: true,
					}),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			const data = await response.json();

			data.forEach((responseMsg: { text: string }) => {
				const botMessage: Message = {
					id: Date.now().toString() + Math.random(),
					content: responseMsg.text,
					isUser: false,
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, botMessage]);
			});
		} catch (error) {
			console.error("Error sending message:", error);
			const errorMessage: Message = {
				id: Date.now().toString(),
				content:
					"Sorry, I couldn't process your message. Please try again.",
				isUser: false,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const toggleExpand = () => {
		setIsExpanded((prev) => !prev);
	};

	return (
		<div
			className={`fixed bottom-4 right-4 ${
				isExpanded ? "w-80 h-96" : "w-12 h-12"
			} bg-white shadow-lg rounded-lg flex flex-col`}
		>
			<div
				className="flex justify-center items-center h-12 w-12 hover:bg-gray-200 rounded-full cursor-pointer border border-gray-200 shadow-sm transition-transform transform hover:scale-105"
				onClick={toggleExpand}
			>
				{isExpanded ? (
					<ChevronDown className="h-4 w-4 text-gray-600" />
				) : (
					<ChevronUp className="h-4 w-4 text-gray-600" />
				)}
			</div>
			{isExpanded && (
				<Card className="flex flex-1 flex-col overflow-hidden">
					<div className="flex-1 overflow-y-auto p-4">
						<div className="flex flex-col gap-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${
										message.isUser
											? "justify-end"
											: "justify-start"
									}`}
								>
									<div
										className={`max-w-[80%] rounded-lg px-4 py-2 ${
											message.isUser
												? "bg-primary text-primary-foreground"
												: "bg-muted"
										}`}
									>
										{message.content}
									</div>
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>
					</div>
					<div className="border-t p-4">
						<div className="flex gap-2">
							<Input
								placeholder="Type a message..."
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={handleKeyPress}
								className="flex-1"
								disabled={isLoading}
							/>
							<Button
								onClick={handleSendMessage}
								size="icon"
								disabled={isLoading}
							>
								<Send className="h-4 w-4" />
								<span className="sr-only">Send message</span>
							</Button>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
};

export default ChatWidget;
