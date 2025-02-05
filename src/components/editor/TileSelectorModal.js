import React from 'react';

function TileSelectorModal({ tileImageElements, setSelectedTile, closeModal }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: '#333',
        padding: '20px',
        borderRadius: '4px',
        color: '#fff'
      }}>
        <h3>Select a Tile</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {Object.keys(tileImageElements).map(tileType => (
            <button key={tileType}
              onClick={() => { setSelectedTile(tileType); closeModal(); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <img src={tileImageElements[tileType].src} alt={tileType} style={{ width: 50, height: 50, display: 'block' }} />
              <div style={{ textAlign: 'center', color: '#fff' }}>
                {tileType.charAt(0).toUpperCase() + tileType.slice(1)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TileSelectorModal;
