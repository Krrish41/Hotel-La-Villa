import React, { useState, useEffect } from 'react';

function App() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');
  const [shouldShowChangedValues, setShouldShowChangedValues] = useState(false);

  const setValues = (newNum1, newNum2, newNum3) => {
    setNum1(newNum1);
    setNum2(newNum2);
    setNum3(newNum3);
  };

  const getValues = () => {
    return { num1, num2, num3 };
  };

  useEffect(() => {
    if (shouldShowChangedValues) {
      const newValues = getValues();
      alert(
        `Changed Values:\nNumber 1: ${newValues.num1}\nNumber 2: ${newValues.num2}\nNumber 3: ${newValues.num3}`
      );
      setShouldShowChangedValues(false);
    }
  }, [shouldShowChangedValues, num1, num2, num3]);

  const handleSubmit = () => {
    const values = getValues();

    alert(
      `Fetched Values:\nNumber 1: ${values.num1}\nNumber 2: ${values.num2}\nNumber 3: ${values.num3}`
    );

    setValues('50', '100', '345454'); 
    setShouldShowChangedValues(true);
  };

  return (
    <div>
      <h1>Getter-Setter</h1>
      <form>
        Enter Number 1:{' '}
        <input
          type="text"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Ex. 20"
        />
        <br /><br />

        Enter Number 2:{' '}
        <input
          type="text"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Ex. 20"
        />
        <br /><br />

        <select value={num3} onChange={(e) => setNum3(e.target.value)}>
          <option value="">Enter the number 3:</option>
          <option value="63444">63444</option>
          <option value="345454">345454</option>
          <option value="925">925</option>
        </select>
        <br /><br />

        <input type="button" value="Submit" onClick={handleSubmit} />
      </form>
    </div>
  );
}

export default App;
