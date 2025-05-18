import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export async function POST(req: NextRequest) {
  const { payload, nonce } = (await req.json()) as IRequestPayload
  const cookieStore = await cookies()
  const storedNonce = cookieStore.get('siwe')?.value

  if (nonce !== storedNonce) {
    return NextResponse.json({ status: 'error', isValid: false, message: 'Invalid nonce' })
  }

  try {
    const result = await verifySiweMessage(payload, nonce)
    return NextResponse.json({ status: 'success', isValid: result.isValid })
  } catch (error: any) {
    return NextResponse.json({ status: 'error', isValid: false, message: error.message })
  }
}
