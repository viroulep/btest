import React, { useState, useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

const previewLength = 30;
const progressFromElapsed = (elapsed) => elapsed * 100 / previewLength;

const PreviewProgress = ({
  preview
}) => {
  const [elapsed, setElapsed] = useState(0.0);
  useEffect(() => {
    if (!preview) return;
    const timer = setInterval(() => {
      setElapsed((prev) => prev >= previewLength ? previewLength : prev + 1);
    }, 1000);
    return () => {
      if (!preview) return;
      setElapsed(0);
      clearInterval(timer);
    }
  }, [setElapsed, preview]);
  return (
    <LinearProgress variant="determinate" value={progressFromElapsed(elapsed)} />
  );
};

export default PreviewProgress;
