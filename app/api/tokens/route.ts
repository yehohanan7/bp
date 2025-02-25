import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            user,
            conversationId,
            payload
        } = body

        console.log("Request received from LLM", body)

        global.sockets.forEach(socket => {
            console.log("sending to ", socket.id)
            socket.emit("tokens", body);
        })

        console.log("Message broadcast to all clients");
        return NextResponse.json({
            success: true,
            message: "Broadcast sent successfully"
        });
    }
    catch (error: any) {
        console.error("Error in tokens route:", error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
} 