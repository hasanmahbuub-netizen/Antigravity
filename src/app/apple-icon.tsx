import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
    width: 180,
    height: 180,
};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F8F5F2',
                    color: '#422B1E',
                }}
            >
                <div style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    background: '#422B1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 80,
                    color: '#F8F5F2',
                    fontFamily: 'sans-serif'
                }}>
                    I
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
