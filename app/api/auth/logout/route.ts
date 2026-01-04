import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createServerComponentClient()
  
  await supabase.auth.signOut()

  return NextResponse.json({ success: true })
}

