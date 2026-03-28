import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(''); 
  const [num3, setNum3] = useState('63444'); 
  const [results, setResults] = useState(['', '', '']);
  const promptShownRef = useRef(false);

  useEffect(() => {
    if (!promptShownRef.current) {
      const promptNum1 = prompt("Enter Number 1:", "20");
      setNum1(parseInt(promptNum1) || 0);
      promptShownRef.current = true; 
    }
  }, []);

  const checkNumbers = () => {
    const n = [num1, parseInt(num2) || 0, num3];
    const newResults = n.map((x) => {
      let result = `${x} is `;

      let sum = 0;
      let y = x;
      while (y > 0) {
        const mod = y % 10;
        sum += mod * mod * mod;
        y = Math.floor(y / 10);
      }
      result += sum === x ? 'Armstrong, ' : 'NOT Armstrong, ';

      let isPrime = true;
      if (x < 2) isPrime = false;
      for (let j = 2; j <= Math.sqrt(x); j++) {
        if (x % j === 0) {
          isPrime = false;
          break;
        }
      }
      result += isPrime ? 'Prime, ' : 'NOT Prime, ';

      let cRama = 0;
      for (let j = 1; j <= Math.cbrt(x); j++) {
        for (let k = j; k <= Math.cbrt(x); k++) {
          if (Math.pow(j, 3) + Math.pow(k, 3) === x) {
            cRama++;
          }
        }
      }
      result += cRama >= 2 ? 'Ramanujan' : 'NOT Ramanujan';

      alert(result);
      return result;
    });
    
    setResults(newResults);
  };

  return (
    <div>
      <h1>Number Checker</h1>
      <button onClick={checkNumbers}>
        Check Numbers
      </button>

      <div>
        <label>Number 2: </label>
        <input 
          type="text" 
          value={num2} 
          onChange={(e) => setNum2(e.target.value)} 
        />
      </div>

      <div>
        <label>Number 3: </label>
        <select value={num3} onChange={(e) => setNum3(e.target.value)}>
          <option value="63444">63444</option>
          <option value="12345">12345</option>
          <option value="67890">67890</option>
        </select>
      </div>

      <p>{results[0]}</p>
      <p>{results[1]}</p>
      <p>{results[2]}</p>
    </div>
  );
}

export default App;