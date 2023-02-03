import React from 'react';
import SudokuBoard from './components/SudokuBoard';

import './styles/normalize.css';
import './styles/App.scss';

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <SudokuBoard />
    </div>
  );
}
