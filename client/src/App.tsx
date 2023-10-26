import { useEffect, useState } from 'react';
import Component from '@components/Component';
import './App.css';

const App = ():JSX.Element => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(3);
  }, []);

  return (
    <div className="card">
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        {`count is ${count}`}
      </button>
      <Component />
    </div>
  );
};

export default App;
