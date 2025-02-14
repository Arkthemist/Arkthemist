export async function getAllCases() {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'; // Use environment variable or default
		const response = await fetch(`${baseUrl}/api/cases`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Failed to fetch cases');
		}

		return response.json();
	} catch (error) {
		console.error('Error fetching all cases:', error);
		return [];
	}
}

export async function getCaseByRoomId(roomId: string) {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'; // Use environment variable or default
		const response = await fetch(`${baseUrl}/api/case-by-roomId/${roomId}`);

		if (!response.ok) {
			throw new Error('Failed to fetch case by roomId');
		}

		return response.json();
	} catch (error) {
		console.error('Error fetching case by roomId:', error);
		return null;
	}
}

export async function getCaseById(id: string) {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
		const response = await fetch(`${baseUrl}/api/cases/${id}`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Failed to fetch case');
		}

		return response.json();
	} catch (error) {
		console.error('Error fetching case:', error);
		return null;
	}
}