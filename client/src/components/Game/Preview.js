import React, { useState, useEffect } from 'react';

const Preview = ({ preview }) => {
  const [audio] = useState(new Audio());
  useEffect(() => {
    if (!preview) return;
    audio.src = preview;
    audio.play();
    return () => audio.pause();
  }, [preview, audio]);
  return <div className="PreviewElement"></div>;
};

export default Preview;
