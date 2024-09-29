import React from 'react';
import './App.css';
import ThreeDRender from './3DRender';
import VideoPlayer from './VideoPlayer';
import CamerasView from './CamerasView';

function App() {
  const [view, setView] = React.useState('camera');

  return (
    <div className="App">
      {view === '3d' ? <ThreeDRender />
      :
      <CamerasView />}  
      <button onClick={() => setView(view === '3d' ? 'camera' : '3d')}>
        Switch
      </button>
    </div>
  );
}

export default App;