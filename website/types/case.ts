export interface Case {
	id: string;
	title: string;
	status: "active" | "resolved";
	createdAt: string;
	priority: "high" | "medium" | "low";
	roomId?: string;
}
