import React, { useState, useEffect } from 'react';

const Preview = ({
  preview
}) => {
  const [audio] = useState(new Audio());
  useEffect(() => {
    if (!preview) return;
    audio.pause();
    audio.src = preview
    audio.play();
  }, [preview, audio]);
  return (
    <div className="PreviewElement"></div>
  );
};

export default Preview;
