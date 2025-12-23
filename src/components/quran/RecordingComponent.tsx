'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Mic, Square, Play, RefreshCw } from 'lucide-react'

interface RecordingComponentProps {
  surahId: number
  ayahNumber: number
  verseText: string
  onRecordingComplete: (feedback: any) => void
}

export function RecordingComponent({
  surahId,
  ayahNumber,
  verseText,
  onRecordingComplete,
}: RecordingComponentProps) {
  const { user } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [feedback, setFeedback] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (recordingUrl) URL.revokeObjectURL(recordingUrl)
    }
  }, [recordingUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      setDuration(0)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        })

        // Create playable URL
        const url = URL.createObjectURL(audioBlob)
        setRecordingUrl(url)

        // Submit for analysis
        await submitRecording(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= 120) {
            // Auto stop at 2 minutes
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error('Microphone error:', error)
      alert('Microphone access denied. Please verify permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const submitRecording = async (audioBlob: Blob) => {
    if (!user) {
        // Allow trial without login or show warning, but for now stick to prompt
        // Assuming user might be navigating freely. 
        // Ideally we should check if user is logged in.
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('surah', String(surahId))
      formData.append('verse', String(ayahNumber))
      if (user?.id) formData.append('userId', user.id)
      formData.append('verseText', verseText)

      const response = await fetch('/api/quran/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()
      setFeedback(data.feedback)
      onRecordingComplete(data.feedback)
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to analyze: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {!feedback ? (
        <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
          {isRecording && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center animate-pulse">
              <p className="text-red-500 font-bold font-mono tracking-widest">
                🔴 REC {formatTime(duration)}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
             <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={loading || isRecording}
                className={`w-full h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    isRecording 
                    ? 'bg-red-500 text-white scale-95 ring-4 ring-offset-2 ring-red-500/30' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isRecording ? (
                    <>
                        <Square className="w-8 h-8 fill-current" />
                        <span className="font-bold text-sm uppercase tracking-widest">Release to Stop</span>
                    </>
                ) : (
                    <>
                        <Mic className="w-8 h-8" />
                        <span className="font-bold text-sm uppercase tracking-widest">Hold to Record</span>
                    </>
                )}
            </button>
          </div>

          {loading && (
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <p className="text-primary font-bold text-sm animate-pulse">⏳ Analyzing recitation...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-50/50 border border-green-200 p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-green-900 flex items-center gap-2">
                  <span>✨</span> Feedback
              </h3>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  Completed
              </div>
          </div>

          {/* Playback */}
          {recordingUrl && (
            <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Your Recitation</p>
              <audio
                ref={audioRef}
                src={recordingUrl}
                controls
                className="w-full h-8"
              />
            </div>
          )}

          {/* Accuracy */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm text-center">
                <span className="block text-3xl font-bold text-green-600 mb-1">{feedback.accuracy || 0}%</span>
                <span className="text-xs text-muted font-medium uppercase tracking-wider">Accuracy</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm text-center flex flex-col items-center justify-center">
                 <span className="text-2xl">🌟</span>
                 <span className="text-xs text-muted font-medium uppercase tracking-wider mt-1">Excellent</span>
            </div>
          </div>

          {/* Strengths */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
              <p className="font-bold text-green-700 text-sm mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                  Strong Points
              </p>
              <ul className="space-y-2">
                {feedback.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                      {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {feedback.improvements && feedback.improvements.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
               <p className="font-bold text-orange-700 text-sm mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-xs">!</span>
                  To Improve
              </p>
              <ul className="space-y-2">
                {feedback.improvements.map((imp: string, i: number) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                      {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Encouragement */}
          {feedback.encouragement && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
              <p className="text-sm text-purple-900 italic leading-relaxed text-center">"{feedback.encouragement}"</p>
            </div>
          )}

          <button
            onClick={() => {
              setFeedback(null)
              setRecordingUrl(null)
              setDuration(0)
            }}
            className="w-full py-4 bg-muted/10 text-foreground hover:bg-muted/20 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Recite Again
          </button>
        </div>
      )}
    </div>
  )
}

