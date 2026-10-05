import { NextRequest, NextResponse } from 'next/server';

// Temporary in-memory storage for sessions
type SessionStatus = 'active' | 'paused' | 'completed' | 'discarded';

interface SessionData {
  id: string;
  problemTitle: string;
  userId?: string;
  startedAt: string;
  endedAt?: string;
  status: SessionStatus;
  activeDuration: number;
  pauseDuration: number;
}

const sessions = new Map<string, SessionData>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  let results = Array.from(sessions.values());
  if (userId) {
    results = results.filter(s => s.userId === userId);
  }

  // Sort by startedAt descending
  results.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return NextResponse.json({ sessions: results });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemTitle, userId } = body;

    if (!problemTitle) {
      return NextResponse.json({ error: 'Problem title is required' }, { status: 400 });
    }

    const newSession: SessionData = {
      id: crypto.randomUUID(),
      problemTitle,
      userId,
      startedAt: new Date().toISOString(),
      status: 'active',
      activeDuration: 0,
      pauseDuration: 0,
    };

    sessions.set(newSession.id, newSession);

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, activeDuration, pauseDuration } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = sessions.get(id);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (activeDuration !== undefined) session.activeDuration = activeDuration;
    if (pauseDuration !== undefined) session.pauseDuration = pauseDuration;

    switch (action) {
      case 'pause':
        session.status = 'paused';
        break;
      case 'resume':
        session.status = 'active';
        break;
      case 'finish':
        session.status = 'completed';
        session.endedAt = new Date().toISOString();
        break;
      case 'discard':
        session.status = 'discarded';
        session.endedAt = new Date().toISOString();
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    sessions.set(id, session);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
