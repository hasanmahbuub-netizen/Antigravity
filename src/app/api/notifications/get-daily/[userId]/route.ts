import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateDailyNotifications } from '@/lib/calculateNotificationTimes';

// Server-side Supabase client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID required' },
                { status: 400 }
            );
        }

        // Get user's notification settings
        const { data: settings, error: settingsError } = await supabaseAdmin
            .from('notification_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (settingsError || !settings) {
            // Return empty schedule if no settings found
            return NextResponse.json({
                notifications: [],
                message: 'No notification settings found'
            });
        }

        // Get location from profiles if not in settings
        let latitude = settings.latitude;
        let longitude = settings.longitude;
        let madhab = 'Hanafi';

        if (!latitude || !longitude) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('madhab')
                .eq('id', userId)
                .single();

            madhab = profile?.madhab || 'Hanafi';

            // Default to Dhaka if no location set
            latitude = latitude || 23.8103;
            longitude = longitude || 90.4125;
        }

        const timezone = settings.timezone || 'Asia/Dhaka';

        // Calculate all notifications for today
        const allNotifications = await calculateDailyNotifications(
            latitude,
            longitude,
            madhab,
            timezone
        );

        // Filter based on user preferences
        const filteredNotifications = allNotifications.filter(n => {
            if (n.type === 'prayer_start' && !settings.prayer_start) return false;
            if (n.type === 'prayer_ending' && !settings.prayer_ending) return false;
            if (n.type === 'dua' && !settings.dua_reminders) return false;
            return true;
        });

        // Only return future notifications
        const now = Date.now();
        const futureNotifications = filteredNotifications.filter(n => n.scheduledTime > now);

        return NextResponse.json({
            notifications: futureNotifications,
            timezone,
            generated: new Date().toISOString()
        });

    } catch (error) {
        console.error('Get daily notifications error:', error);
        return NextResponse.json(
            { error: 'Failed to get notifications', details: String(error) },
            { status: 500 }
        );
    }
}
