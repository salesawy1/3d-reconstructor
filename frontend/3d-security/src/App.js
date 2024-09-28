import React from 'react';
import './App.css';
import ThreeDRender from './3DRender';
import VideoPlayer from './VideoPlayer';
import CamerasView from './CamerasView';

function App() {
  return (
    <div className="App">
      {/* <CamerasView /> */}
      <ThreeDRender modelPath="/mesh.obj" />
    </div>
  );
}

export default App;