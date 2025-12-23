import { NextRequest, NextResponse } from 'next/server'
import { syncAllQuranData, syncSurahsToDatabase, syncVersesToDatabase } from '@/lib/quran-github'

export async function POST(request: NextRequest) {
    try {
        // Check for admin authorization
        const authHeader = request.headers.get('authorization')
        const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!authHeader?.includes(expectedKey?.slice(0, 20) || 'service')) {
            // Check for simple admin password
            const body = await request.json().catch(() => ({}))
            if (body.secret !== 'MEEK-sync-2024') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        }

        const url = new URL(request.url)
        const type = url.searchParams.get('type') || 'all'

        console.log(`🚀 Starting Quran sync (type: ${type})...`)

        let result: { surahs?: number; verses?: number; success: boolean; error?: string }

        if (type === 'surahs') {
            const surahResult = await syncSurahsToDatabase()
            result = { surahs: surahResult.count, success: surahResult.success, error: surahResult.error }
        } else if (type === 'verses') {
            const verseResult = await syncVersesToDatabase()
            result = { verses: verseResult.count, success: verseResult.success, error: verseResult.error }
        } else {
            const allResult = await syncAllQuranData()
            result = { ...allResult, success: true }
        }

        return NextResponse.json({
            message: 'Quran data sync complete',
            ...result
        })
    } catch (error) {
        console.error('Sync error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Sync failed' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.json({
        message: 'Quran sync endpoint',
        usage: {
            method: 'POST',
            body: { secret: 'MEEK-sync-2024' },
            params: {
                'type=surahs': 'Sync only surahs',
                'type=verses': 'Sync only verses',
                'type=all': 'Sync everything (default)'
            }
        }
    })
}

