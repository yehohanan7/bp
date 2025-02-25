import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            user,
            conversationId,
            payload
        } = body

        console.log("request recieved from LLM", body)

        // For now, we'll just return an empty JSON response
        return NextResponse.json({})
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
} 