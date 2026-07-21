import { NextResponse } from 'next/server';
import { supabaseServer, supabaseAdmin } from '@/lib/supabaseServer';
import { getMovieStatus } from '@/lib/json2video';

export async function GET(req, { params }) {
  const { id } = params;

  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });

  const admin = supabaseAdmin();
  const { data: video } = await admin.from('videos').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (video.status !== 'processing') {
    return NextResponse.json({ video });
  }

  try {
    const status = await getMovieStatus(video.json2video_project);
    const state = status.movie?.status || status.status;
    const url = status.movie?.url || status.url;

    if (state === 'done' || state === 'ready' || state === 'success') {
      const { data: updated } = await admin
        .from('videos')
        .update({ status: 'done', video_url: url })
        .eq('id', id)
        .select()
        .single();
      return NextResponse.json({ video: updated });
    }
    if (state === 'error' || state === 'failed') {
      const { data: updated } = await admin
        .from('videos')
        .update({ status: 'failed' })
        .eq('id', id)
        .select()
        .single();
      return NextResponse.json({ video: updated });
    }
    return NextResponse.json({ video });
  } catch (err) {
    return NextResponse.json({ video });
  }
}
