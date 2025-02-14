import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Case from '@/models/Case';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Extract roomId from the URL pathname
    const url = new URL(request.url);
    const roomId = url.pathname.split('/').pop(); // Extract the roomId from the URL

    // If no roomId is provided, return error
    if (!roomId) {
      return NextResponse.json(
        { error: 'roomId is required' },
        { status: 400 }
      );
    }

    // If roomId is provided, return cases for that room
    const cases = await Case.find({ roomId }).sort({ createdAt: -1 });
    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}
