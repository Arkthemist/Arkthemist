import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Form from '@/models/Form';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const headers = request.headers;

    const userType = headers.get('user-type');
    const userId = headers.get('user-id');

    if (!userType || !userId) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    const { type, lawyer, user_id, input, documentUrl, amount, currency } = body;

    // Validate required fields
    if (!type || !lawyer || !user_id || !input || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newForm = new Form({
      type,
      case_status: 'pending-lawyer',
      lawyer,
      user_id,
      input,
      documentUrl,
      amount,
      currency,
      createdBy: { userType, userId },
    });

    const savedForm = await newForm.save();
    return NextResponse.json(savedForm, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const headers = request.headers;
    const userType = headers.get('user-type');
    const userId = headers.get('user-id');

    if (!userType || !userId) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    let forms;
    if (userType === 'lawyer') {
      forms = await Form.find({ lawyer: userId }).sort({ createdAt: -1 });
    } else if (userType === 'client') {
      forms = await Form.find({ user_id: userId }).sort({ createdAt: -1 });
    } else {
      return NextResponse.json(
        { error: 'Invalid user-type' },
        { status: 400 }
      );
    }

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const { id, ...updateFields } = body;

    console.log('body', body)

    // Validate that an ID is provided
    if (!id) {
      return NextResponse.json(
        { error: 'Missing form ID' },
        { status: 400 }
      );
    }

    // Find the form by ID and update it with the provided fields
    const updatedForm = await Form.findByIdAndUpdate(id, updateFields, { new: true });

    console.log('updatedForm', updatedForm)

    if (!updatedForm) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedForm, { status: 200 });
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    );
  }
}
