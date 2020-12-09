import React, { useState, useEffect } from 'react';

const Preview = ({ preview, volume }) => {
  const [audio] = useState(new Audio());
  useEffect(() => {
    if (!preview) return;
    audio.src = preview;
    audio.play();
    return () => audio.pause();
  }, [preview, audio]);

  useEffect(() => {
    audio.volume = volume / 100;
  }, [audio, volume]);
  return <div className="PreviewElement"></div>;
};

export default Preview;
