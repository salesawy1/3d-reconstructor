import React from 'react';
import './App.css';
import ThreeDRender from './3DRender';
import VideoPlayer from './VideoPlayer';
import CamerasView from './CamerasView';

function App() {
  return (
    <div className="App">
      <CamerasView />
      {/* <ThreeDRender modelPath="/apple.obj" /> */}
    </div>
  );
}

export default App;