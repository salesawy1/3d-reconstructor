import React from 'react';
import './App.css';
import ThreeDRender from './3DRender';

function App() {
  return (
    <div className="App">
      <ThreeDRender modelPath="/objFiles/apple.obj" />
    </div>
  );
}

export default App;