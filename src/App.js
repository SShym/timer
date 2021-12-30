import './App.css'
import React, { useEffect, useState, useCallback } from 'react'
import { Observable } from "rxjs";

const App = () => {
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState("stop");
  const [prevent, setPrevent] = useState(true);

  useEffect(() => {
    const stream$ = new Observable((observer) => {
      if(status === 'start'){
        const intervalId = setInterval(() => {
          observer.next(setTime((val) => val + 1000));
        }, 1000);

        return () => {
          clearInterval(intervalId);
        };
      }
    }).subscribe({next: () => setTime});

    return (() => {
      stream$.unsubscribe();
    });
  }, [status]);
 
  const start = useCallback(() => setStatus("start"), []);
  const stop = useCallback(() => { setStatus("stop"); setTime(0) }, []);
  const reset = useCallback(() => setTime(0), []);
 
  const wait = () => {
    if (prevent) {
      setPrevent(false);
      const timerInstance = setTimeout(function () {
        setPrevent(true);
        clearTimeout(timerInstance);
      }, 300);
    } else {
      if (time) {
        setStatus('wait')
      }
    }
  };

  return (
    <div>
      <h1>
        {new Date(time).toISOString().slice(11, 19)}
      </h1>
      <div>
        {status === 'start'
          ? <button type="button" onClick={stop}>STOP</button>
          : <button type="button" onClick={start}>START</button>
        }
        <button type="button" onClick={wait}>WAIT</button>
        <button type="button" onClick={reset}>RESET</button>
      </div>
    </div>
  );
};

export default App;