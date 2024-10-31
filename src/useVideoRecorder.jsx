import { useState, useRef, useEffect } from 'react';

const useVideoRecorder = (maxDuration = 180) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState(null); 
  const [isRecordingComplete, setIsRecordingComplete] = useState(false); 
  const [resetShare, setResetShare] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const canvasContextRef = useRef(null);
  const animationFrameRef = useRef(null);

  const getSupportedMimeType = () => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
      return 'video/mp4';
    }

    const types = [
      'video/webm;codecs=h264',
      'video/webm',
      'video/mp4'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return null;
  };

  const startRecording = async (canvas) => {
    if (!canvas || isRecording) {
      return;
    }

    try {
      canvasContextRef.current = canvas.getContext('2d', {
        alpha: false,
        willReadFrequently: true
      });

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      let stream = canvas.captureStream(isSafari ? 30 : 60);

      const mimeType = getSupportedMimeType();
      if (!mimeType) {
        throw new Error('No supported mime type found for this browser');
      }

      const options = {
        mimeType,
        videoBitsPerSecond: isSafari ? 2000000 : 8000000
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      chunksRef.current = [];
      setRecordingBlob(null);
      setIsRecordingComplete(false);
      setResetShare(false);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blobMimeType = mimeType.split(';')[0];
        const blob = new Blob(chunksRef.current, { type: blobMimeType });
        setRecordingBlob(blob);
        setIsRecordingComplete(true);
        setResetShare(true);
      };

      mediaRecorderRef.current.start(isSafari ? 1000 : 100);
      setIsRecording(true);
      startTimeRef.current = Date.now();
      startProgressTracking(maxDuration);

      timeoutRef.current = setTimeout(() => {
        stopRecording();
      }, maxDuration * 1000);
    } catch (error) {
      console.error('Detailed error during recording setup:', error);
      setIsRecording(false);
      alert('Recording failed to start. ' + (error.message || 'Unknown error.'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      stopProgressTracking();
    }
  };

  const startProgressTracking = (duration) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setProgress(0);
    startTimeRef.current = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const progressPercent = Math.min((elapsedTime / (duration * 1000)) * 100, 100);
      setProgress(progressPercent);
      if (progressPercent >= 100) {
        stopProgressTracking();
      }
    }, 50);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    startTimeRef.current = null;
    setIsRecording(false);
    setProgress(0);
  };

  const shareRecording = () => {
    setResetShare(false);

    if (!recordingBlob) return;

    const blobMimeType = recordingBlob.type;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (navigator.userAgent.match(/iPad|iPhone|iPod/i)) {
      if (navigator.share) {
        const file = new File([recordingBlob], `Recording-${Date.now()}.mp4`, {
          type: blobMimeType
        });
        
        navigator.share({
          files: [file],
          title: 'Share Video',
          text: 'Check out my video!'
        }).catch(error => {
          console.error('Share failed:', error);
          downloadRecording();
        });
      } else {
        downloadRecording();
      }
    } else {
      downloadRecording();
    }
  };

  const downloadRecording = () => {
    if (!recordingBlob) return;

    const url = URL.createObjectURL(recordingBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Recording-${Date.now()}.${recordingBlob.type.includes('webm') ? 'webm' : 'mp4'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopRecording();
      stopProgressTracking();
    };
  }, []);

  return {
    isRecording,
    progress,
    isRecordingComplete,
    resetShare,
    startRecording,
    stopRecording,
    shareRecording
  };
};

export default useVideoRecorder;

