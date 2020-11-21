import React, { useState, useEffect, useCallback } from 'react';
import { gameAttemptUrl } from '../../requests/routes';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';

const defaultStatus = {
  success: false,
  message: "Type something",
};

const AnswerForm = ({
  slug,
  currentTrack,
}) => {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(defaultStatus);

  // Reset on game/track change
  useEffect(() => {
    setValue("");
    setStatus(defaultStatus);
  }, [slug, currentTrack]);

  const submitAnswer = useCallback((ev) => {
    console.log("submitting!");
    ev.preventDefault();
    const query = ev.target.query.value;
    if (query.length <= 0) {
      return;
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: ev.target.query.value })
    };
    fetchJsonOrError(gameAttemptUrl(slug), requestOptions)
        .then(setStatus);
    setValue("");
  }, [slug, setValue, setStatus]);

  const { message, success } = status;

  return (
    <div>
      <form onSubmit={submitAnswer}>
        <input name="query" type="text" value={value} onChange={e => setValue(e.target.value)} />
        <input type="submit" value="Submit" />
        <p style={{ minHeight: "30px" }}>
          <span>{message} (nice: {success ? "yes" : "no"})</span>
        </p>
      </form>
    </div>
  );
};

export default AnswerForm;
