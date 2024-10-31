import React, { useState, useRef, useEffect,useMemo } from 'react';
import { Canvas,useThree } from '@react-three/fiber';
import useVideoRecorder from './useVideoRecorder.jsx';
import Experience from './Experience.jsx';
import './styles.css'


function App() {
  const maxRecordingDuration = 120; // 2 minutes max
  const canvasRef = useRef();

  useEffect(() => {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    appHeight();
    window.addEventListener('resize', appHeight);
    window.addEventListener('orientationchange', appHeight);
    return () => {
      window.removeEventListener('resize', appHeight);
      window.removeEventListener('orientationchange', appHeight);
    };
  }, []);

  const {
    isRecording,
    progress,
    isRecordingComplete,
    resetShare,
    startRecording,
    stopRecording,
    shareRecording
  } = useVideoRecorder(maxRecordingDuration);

  const handleRecordingToggle = () => {
    if (!isRecording) {
      const canvas = document.querySelector('.canvas-container canvas');
      if (canvas) {
        console.log('Canvas found, starting recording...');
        startRecording(canvas);
      } else {
        console.error('Canvas not found');
      }
    } else {
      stopRecording();
    }
  };

  const DebugInfo = () => (
    <div className="debug-info">
      <div>Recording: {isRecording ? 'Yes' : 'No'}</div>
      <div>Progress: {progress.toFixed(1)}%</div>
      <div>Max Duration: {maxRecordingDuration}s</div>
      <div>Time Left: {((maxRecordingDuration * (100 - progress)) / 100).toFixed(1)}s</div>
    </div>
  );

  return (
    <>
      <div className="app-container">

      {/* recording UI */}
      <div className="recording-controls">
        {isRecording &&(
          <div className="progress-container">
          <div className="progress-bar">
            <div
              className={`progress-fill ${isRecording ? 'recording' : 'ready'}`}
              style={{ width: `${progress}%`, '--progress': `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            {isRecording ?
              `Recording: ${progress.toFixed(1)}% (${((maxRecordingDuration * (100 - progress)) / 100).toFixed(1)}s left)` :
              `Ready to record : max ${maxRecordingDuration}s`}
          </div>
        </div>)}
      
        {isRecordingComplete && resetShare ? (<button className="share-button" onClick={shareRecording}>Share Recording</button>):(<button className="record-button" onClick={handleRecordingToggle}>
          <span className={`record-indicator ${isRecording ? 'recording' : 'ready'}`} />
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>)}
      </div>
      

      <DebugInfo />
     
      <Canvas
        ref={canvasRef}
        camera={{position:[3,-3,8], fov:50}}
        // for recording
        className="canvas-container"
        gl={{
          preserveDrawingBuffer: true,
          alpha: true
        }}
      >
        {/* Need to set a background color for recording purposes */}
        <color attach="background" args={["#0f1212"]} />

        {/* Your 3D Scene here */}
        <Experience />

      </Canvas>

      </div>
    </>
  )
}

export default App
