import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-loaded Supabase admin client (prevents build errors when env vars are missing)
let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
    if (!supabaseAdmin) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            throw new Error('Missing Supabase credentials');
        }

        supabaseAdmin = createClient(url, key);
    }
    return supabaseAdmin;
}

interface PushSubscriptionJSON {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        // Get subscription from request
        const subscription: PushSubscriptionJSON = await request.json();

        if (!subscription.endpoint || !subscription.keys) {
            return NextResponse.json(
                { error: 'Invalid subscription format' },
                { status: 400 }
            );
        }

        // Get user from auth header
        const authHeader = request.headers.get('authorization');
        let userId: string | null = null;

        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token);
            if (!error && user) {
                userId = user.id;
            }
        }

        // If no auth, try to get from cookie
        if (!userId) {
            const cookieHeader = request.headers.get('cookie');
            // Parse supabase auth cookie if present
            // For now, we'll allow anonymous subscriptions for testing
        }

        // Upsert subscription (update if endpoint exists, insert otherwise)
        const { data, error } = await getSupabaseAdmin()
            .from('notification_subscriptions')
            .upsert({
                user_id: userId,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                is_active: true,
                user_agent: request.headers.get('user-agent'),
                last_used_at: new Date().toISOString()
            }, {
                onConflict: 'endpoint'
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to save subscription:', error);
            return NextResponse.json(
                { error: 'Failed to save subscription' },
                { status: 500 }
            );
        }

        // Initialize default notification settings if user is authenticated
        if (userId) {
            await getSupabaseAdmin()
                .from('notification_settings')
                .upsert({
                    user_id: userId,
                    prayer_start: true,
                    prayer_ending: true,
                    dua_reminders: true,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });
        }

        return NextResponse.json({
            success: true,
            subscriptionId: data.id
        });

    } catch (error) {
        console.error('Subscribe API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
    try {
        const { endpoint } = await request.json();

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Endpoint required' },
                { status: 400 }
            );
        }

        const { error } = await getSupabaseAdmin()
            .from('notification_subscriptions')
            .update({ is_active: false })
            .eq('endpoint', endpoint);

        if (error) {
            return NextResponse.json(
                { error: 'Failed to unsubscribe' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Unsubscribe API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
