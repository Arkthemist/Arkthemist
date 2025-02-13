import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Case from '@/models/Case';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();

    console.log('body', body)

    const { title, description, userId, roomId } = body;

    // Validate required fields
    if (!title || !description || !userId || !roomId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newCase = new Case({
      title,
      description,
      userId,
      roomId,
      status: 'open',
    });

    const savedCase = await newCase.save();
    return NextResponse.json(savedCase, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    
    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

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