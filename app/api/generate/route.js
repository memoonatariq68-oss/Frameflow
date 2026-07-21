import { NextResponse } from 'next/server';
import { supabaseServer, supabaseAdmin } from '@/lib/supabaseServer';
import { renderMovie } from '@/lib/json2video';
import { CREDIT_COST_PER_VIDEO } from '@/lib/pricing';

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt || prompt.trim().length < 10) {
    return NextResponse.json({ error: 'Please write a longer script (at least a sentence or two).' }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  }

  const admin = supabaseAdmin();

  const { data: profile, error: profileErr } = await admin
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json({ error: 'Could not read your account.' }, { status: 500 });
  }
  if (profile.credits < CREDIT_COST_PER_VIDEO) {
    return NextResponse.json({ error: 'Not enough credits. Buy more on the pricing page.' }, { status: 402 });
  }

  let project;
  try {
    project = await renderMovie(prompt);
  } catch (err) {
    return NextResponse.json({ error: `Video render failed to start: ${err.message}` }, { status: 502 });
  }

  await admin.from('profiles').update({ credits: profile.credits - CREDIT_COST_PER_VIDEO }).eq('id', user.id);

  const projectId = typeof project === 'string' ? project : project.project || project.id;

  const { data: video, error: videoErr } = await admin
    .from('videos')
    .insert({
      user_id: user.id,
      prompt,
      status: 'processing',
      json2video_project: projectId,
      credits_used: CREDIT_COST_PER_VIDEO,
    })
    .select()
    .single();

  if (videoErr) {
    return NextResponse.json({ error: 'Render started but we could not save it. Contact support.' }, { status: 500 });
  }

  return NextResponse.json({ video });
}
