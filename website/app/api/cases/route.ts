import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Case from '@/models/Case';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    console.log('body', body)

    const { title, description, userId, roomId, partyA, partyB, amount } = body;

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
      status: 'active',
      partyA,
      partyB,
      amount
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

    const allCases = await Case.find().sort({ createdAt: -1 });
    return NextResponse.json(allCases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
} 