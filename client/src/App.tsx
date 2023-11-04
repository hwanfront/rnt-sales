import { useEffect, useState } from 'react';

import Component from '@components/Component';
import './App.css';

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState({ firstName: '', secondName: '' });

  useEffect(() => {
    setCount(3);
    setName({ firstName: 'first', secondName: 'second' });
  }, []);

  return (
    <div className="card">
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        {`count is ${count}`}
      </button>
      <Component tel="010101010" firstName={name.firstName} secondName={name.secondName} />
    </div>
  );
};

export default App;
