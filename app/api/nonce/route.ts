import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, '')
  const cookieStore = await cookies()
  cookieStore.set('siwe', nonce, { secure: true, httpOnly: true })

  return NextResponse.json({ nonce })
}