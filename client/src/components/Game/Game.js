import React, { useReducer, useState, useEffect } from 'react';
import Preview from './Preview';
import Marks from '../Answer/Marks';
import { Grid } from '@material-ui/core';
import AnswerForm from '../Answer/Form';
import PastTracks from './PastTracks';
import { gameStartUrl, gameStopUrl } from '../../requests/routes';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import consumer from '../../channels/consumer';

const dispatcher = (state, action) => {
  const { type, data } = action;
  console.log("dispatcher");
  console.log(type);
  console.log(data);
  switch (type) {
    case 'rankings':
      return {
        ...state,
        rankings: data,
      }
    case 'state':
      return data;
    default:
      throw new Error();
  }
};

const currentAnswer = (rankings, me) => {
  const myRank = rankings.find(el => (
    el.id === me.id && el.anonymous === me.anonymous
  ));
  return myRank ? myRank.current : null;
};

const stopGame = (slug, setMsg) => {
  fetchJsonOrError(gameStopUrl(slug), { method: 'POST' })
    .then((data) => {
      setMsg(`Success: ${data.success ? "yes" : "no"}, msg: ${data.message}`);
    });
};

const startGame = (slug, setMsg) => {
  fetchJsonOrError(gameStartUrl(slug), { method: 'POST' })
    .then((data) => {
      setMsg(`Success: ${data.success ? "yes" : "no"}, msg: ${data.message}`);
    });
};

const handleReceive = (data, setMsg, changeState, setPreview) => {
  console.log("received some data haha");
  console.log(data);
  const { rankings, state, preview } = data;
  console.log(rankings);
  if (rankings) {
    changeState({
      type: 'rankings',
      data: rankings,
    });
  }
  if (state) {
    // If we receive a full state it's a sync from the server.
    changeState({
      type: 'state',
      data: state,
    });
    if (preview) {
      const { title, artist } = state.current;
      setMsg(`Cheater mode: received ${title} from ${artist}`);
      setPreview(preview);
    }
  }
};

const Game = ({
  game,
  setMsg,
  me,
}) => {
  const [state, changeState] = useReducer(dispatcher, game);
  const { slug, rankings, tracks, current_track } = state;
  const [preview, setPreview] = useState(null);

  // The subscription
  useEffect(() => {
    if (!slug)
      return;
    console.log("gameId has changed to: " + slug);
    const sub = consumer.subscriptions.create({
      channel: "GameChannel",
      id: slug,
    }, {
      received: (data) => handleReceive(data, setMsg, changeState, setPreview),
    })
    return () => {
      if (!slug)
        return;
      consumer.subscriptions.remove(sub);
      console.log("cleanup for: " + slug);
    };
  }, [slug, setMsg, changeState, setPreview]);
  console.log("game#show");
  console.log(state);
  return (
    <>
      <h2>
        Selected game: {slug}
        <button onClick={() => startGame(slug, setMsg)}>
          go
        </button>
        <button onClick={() => stopGame(slug, setMsg)}>
          stop
        </button>
      </h2>
      <h3>State</h3>
      <Preview preview={preview} />
      <p>{current_track + 1}/15</p>
      <AnswerForm slug={slug} currentTrack={current_track} />
      <div>
        Current answer:
        <Marks data={currentAnswer(rankings, me)} />
      </div>
      <h3>Rankings</h3>
      <ol>
        {rankings.map((v, k) => (
          <li key={k}>
            {v.name} ({v.points} points)
            (marks: <Marks data={v.current} />)
          </li>
        ))}
      </ol>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PastTracks slug={slug} tracks={tracks} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PastTracks slug={slug} tracks={tracks} />
        </Grid>
      </Grid>
    </>
  );
};

export default Game;
