import React from 'react';

function Sidebar({
  currentTool,
  setCurrentTool,
  selectedTile,
  setShowTileSelector,
  selectedObject,
  setShowObjectSelector,
  tileDataRef,
  tileImageElements,
  objectImageElements
}) {
  return (
    <div style={{
      position: 'absolute',
      left: 10,
      top: 10,
      background: '#333',
      color: '#fff',
      padding: '10px',
      borderRadius: '4px',
      zIndex: 10,
    }}>
      <h3>Tools</h3>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setCurrentTool("tile")}
          style={{ backgroundColor: currentTool === "tile" ? '#555' : '#777', marginRight: '5px' }}>
          Tile Tool
        </button>
        <button onClick={() => setCurrentTool("object")}
          style={{ backgroundColor: currentTool === "object" ? '#555' : '#777', marginRight: '5px' }}>
          Object Tool
        </button>
        <button onClick={() => setCurrentTool("delete")}
          style={{ backgroundColor: currentTool === "delete" ? '#555' : '#777', marginRight: '5px' }}>
          Delete Tool
        </button>
        <button onClick={() => setCurrentTool("move")}
          style={{ backgroundColor: currentTool === "move" ? '#555' : '#777', marginRight: '5px' }}>
          Move Tool
        </button>
        <button onClick={() => setCurrentTool("cursor")}
          style={{ backgroundColor: currentTool === "cursor" ? '#555' : '#777' }}>
          Cursor Tool
        </button>
      </div>
      {currentTool === "tile" && (
        <div>
          <h4>Current Tile</h4>
          <button onClick={() => setShowTileSelector(true)}
            style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
            <img
              src={tileImageElements[selectedTile].src}
              alt={selectedTile}
              style={{ width: 50, height: 50 }}
            />
          </button>
        </div>
      )}
      {currentTool === "object" && (
        <div>
          <h4>Current Object</h4>
          <button onClick={() => setShowObjectSelector(true)}
            style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
            <img
              src={objectImageElements[selectedObject].src}
              alt={selectedObject}
              style={{ width: 50, height: 50 }}
            />
          </button>
        </div>
      )}
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => console.log(tileDataRef.current)}
          style={{
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px'
          }}>
          Print Data Structure
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
