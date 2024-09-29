import React from 'react';
import './App.css';
import ThreeDRender from './3DRender';
import VideoPlayer from './VideoPlayer';
import CamerasView from './CamerasView';

function App() {
  const [view, setView] = React.useState('camera');
  const [currentTime, setCurrentTime] = React.useState(0);

  return (
    <div className="App">
      {view === '3d' ? <ThreeDRender currentTime={currentTime} />
      :
      <CamerasView 
        view={view} 
        setView={setView}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}/>}  
    </div>
  );
}

export default App;