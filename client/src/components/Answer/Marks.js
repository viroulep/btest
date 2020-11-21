import React from 'react';

const defaultAnswer = {
  artist: false,
  title: false,
  fast: false,
  worthy_position: 0,
  total_points: 0,
};

const Marks = ({
  data,
}) => {
  const answer = data ? data : defaultAnswer;
  return (
    <div>
      artist:
      {answer.artist ? (
        "ok"
      ) : (
        "ko"
      )}
      , title:
      {answer.title ? (
        "ok"
      ) : (
        "ko"
      )}
      , fast:
      {answer.fast ? (
        "ok"
      ) : (
        "ko"
      )}
      , worthy position:
      {answer.worthy_position}
      , points:
      {answer.total_points}
    </div>
  )
};

export default Marks;
