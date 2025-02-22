import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, userType, email, walletAddress, specialty } = body;

    // Check if user exists with this wallet address
    let user = await User.findOne({ walletAddress });

    if (user) {
      // Only update fields that are provided
      if (name) user.name = name;
      if (userType) user.userType = userType;
      if (email) user.email = email;
      if (specialty) user.specialty = specialty;
      await user.save();
    } else {
      // Create new user with only the provided fields
      user = new User({
        walletAddress,
        ...(name && { name }),
        ...(userType && { userType }),
        ...(email && { email }),
        ...(specialty && { specialty })
      });
      await user.save();
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (userId) {
      // Get single user
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    }

    // Get all users
    const allUsers = await User.find().sort({ createdAt: -1 });
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 