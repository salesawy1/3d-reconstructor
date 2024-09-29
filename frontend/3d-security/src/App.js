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
      <CamerasView view={view} setView={setView}/>}  
    </div>
  );
}

export default App;