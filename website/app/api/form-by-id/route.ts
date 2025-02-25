import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Form from '@/models/Form';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate that an ID is provided
    if (!id) {
      return NextResponse.json(
        { error: 'Missing form ID' },
        { status: 400 }
      );
    }

    // Find the form by ID
    const form = await Form.findById(id);

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(form, { status: 200 });
  } catch (error) {
    console.error('Error fetching form by ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    );
  }
} 