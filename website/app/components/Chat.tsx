"use client";

import { Send } from "lucide-react";
import { useRef, useState, useEffect } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

interface Message {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
}

const ELIZA_API_URL = process.env.NEXT_PUBLIC_ELIZA_API_URL;
const AGENT_ID = "a9e6b80b-7aa5-090a-a403-36c9d676c764";
//a9e6b80b-7aa5-090a-a403-36c9d676c764
//old one 138a1128-44dc-02a2-98db-91ee472faa5f

interface ChatProps {
	externalMessages: any;
}

export const Chat = ({ externalMessages }: ChatProps) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [hasRunEffect, setHasRunEffect] = useState(false); // Add a flag state

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const roomId =
		new URLSearchParams(window.location.search).get("roomId") || "1";

	// useEffect(() => {
	//   if (!hasRunEffect && externalMessages) {
	//     setMessages((prev) => [...prev, ...externalMessages]);
	//     setHasRunEffect(true); // Set the flag to true after running the effect
	//   }
	// }, [externalMessages, hasRunEffect]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

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
						roomId: roomId,
						userName: "User",
						unique: true,
					}),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			const data = await response.json();

			// Handle each message in the response
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
			// Optionally add an error message to the chat
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
			setTimeout(scrollToBottom, 100);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	console.log("messages", messages);

	return (
		<div className="flex flex-1 flex-col gap-4 pt-0">
			<Card className="flex flex-1 flex-col">
				<div className="flex-1 overflow-y-auto p-4">
					<div className="flex flex-col gap-4">
						{externalMessages.map((message: any) => {
							return (
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
							);
						})}
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
		</div>
	);
};
