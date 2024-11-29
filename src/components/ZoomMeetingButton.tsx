import React, { useState } from 'react';
import { Video } from 'lucide-react';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import * as zoomService from '../services/zoomService';

interface ZoomMeetingButtonProps {
  lessonId: string;
  isDisabled?: boolean;
}

export function ZoomMeetingButton({ lessonId, isDisabled }: ZoomMeetingButtonProps) {
  const { student } = useStudentAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinMeeting = async () => {
    if (!student) return;
    
    try {
      setIsJoining(true);
      setError(null);
      
      // Record join time
      await zoomService.joinZoomMeeting(lessonId, student.id);
      
      // Get Zoom URL with pre-filled info
      const zoomUrl = await zoomService.getZoomMeetingUrl(
        lessonId,
        student.user_metadata?.full_name || student.email,
        student.email
      );

      // Open Zoom meeting in new window
      const meetingWindow = window.open(zoomUrl, '_blank');
      
      if (meetingWindow) {
        // Handle leave time when window closes
        const checkWindow = setInterval(() => {
          if (meetingWindow.closed) {
            clearInterval(checkWindow);
            zoomService.leaveZoomMeeting(lessonId, student.id)
              .catch(console.error);
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Error joining meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to join meeting');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleJoinMeeting}
        disabled={isDisabled || isJoining}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Video className="h-5 w-5 mr-2" />
        {isJoining ? 'Joining...' : 'Join Meeting'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}