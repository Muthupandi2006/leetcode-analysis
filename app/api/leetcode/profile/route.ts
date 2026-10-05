import { NextRequest, NextResponse } from 'next/server';
import { fetchLeetCodeProfile } from '@/lib/leetcode/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Alphanumeric, 1-39 chars (LeetCode username rules)
    const usernameRegex = /^[a-zA-Z0-9_-]{1,39}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
    }

    const profile = await fetchLeetCodeProfile(username);
    
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    if (error.message && error.message.includes('Rate limit')) {
      return NextResponse.json({ error: 'Rate limited. Try again later.' }, { status: 429 });
    }
    console.error('Error fetching LeetCode profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
