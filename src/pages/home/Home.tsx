import { useState, useEffect } from 'react';

import useFetch from '../../hooks/useFetch';

import { logError, isDefined } from '../../module/systemModule';

import './Home.scss';
import Loader from '../../components/loader/Loader';
import ReactLogo from '../../assets/react.svg?react';

function Home() {
  const fetch = useFetch();

  const [count, setCount] = useState<number | undefined>();

  useEffect(() => {
    fetch('/api/admin/count')
      .then(({ ok, data, message }) => {
        if (!ok) {
          throw new Error(message);
        }

        const { count } = data as { count: number };

        setCount(count);
      })
      .catch((err: unknown) => {
        logError('get count', err);
      });
  }, [fetch]);

  function buttonClickHandler() {
    setCount((prevCount) => (prevCount ?? 0) + 1);
  }

  return (
    <div className="home">
      <a href="https://react.dev" target="_blank" rel="noreferrer">
        <ReactLogo />
      </a>

      {isDefined(count) ? (
        <button onClick={buttonClickHandler}>count is {count}</button>
      ) : (
        <button>
          <Loader isLight isThin />
        </button>
      )}
    </div>
  );
}

export default Home;
