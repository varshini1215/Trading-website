import React from 'react';
import InstrumentTable from './Components/InstrumentsTable';
import './App.css';

function App(){
  return(
    <div className='App'>
      <header className='App-header'>
        <h1>Trading Table</h1>
        <InstrumentTable/>
      </header>
    </div>
  );
}
export default App;