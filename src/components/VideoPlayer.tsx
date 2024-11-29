import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import * as attendanceService from '../services/attendanceService';

interface VideoPlayerProps {
  lessonId: string;
  videoUrl: string;
  videoProvider: 'youtube' | 'vimeo';
  onComplete?: () => void;
}

export function VideoPlayer({ lessonId, videoUrl, videoProvider, onComplete }: VideoPlayerProps) {
  const { t } = useTranslation();
  const { student } = useStudentAuth();
  const [isWatching, setIsWatching] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    const extractVideoId = (url: string) => {
      if (videoProvider === 'youtube') {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
      } else if (videoProvider === 'vimeo') {
        const match = url.match(/vimeo\.com\/(?:.*\/)?([0-9]+)/);
        return match ? match[1] : null;
      }
      return null;
    };

    const id = extractVideoId(videoUrl);
    console.log('Extracted video ID:', id, 'from URL:', videoUrl);
    setVideoId(id);
  }, [videoUrl, videoProvider]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const startWatching = async () => {
      if (!student?.id || !lessonId) return;

      try {
        console.log('Recording attendance start:', { lessonId, studentId: student.id });
        await attendanceService.recordAttendance(lessonId, student.id, {
          joinTime: new Date().toISOString(),
          leaveTime: ''
        });
        setIsWatching(true);

        cleanup = () => {
          console.log('Recording attendance end');
          attendanceService.updateAttendance(lessonId, student.id, {
            leaveTime: new Date().toISOString()
          }).catch(console.error);
        };
      } catch (error) {
        console.error('Error recording video attendance:', error);
      }
    };

    startWatching();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [lessonId, student]);

  if (!videoId) {
    console.error('Invalid video URL:', videoUrl);
    return <div className="text-red-600">{t('video.invalidUrl')}</div>;
  }

  const embedUrl = videoProvider === 'youtube'
    ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
    : `https://player.vimeo.com/video/${videoId}`;

  return (
    <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        title={t(`video.${videoProvider}Video`)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}