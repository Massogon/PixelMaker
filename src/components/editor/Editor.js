import React, { useRef, useState, useEffect, useMemo } from 'react';
import Canvas from './Canvas';
import Sidebar from './Sidebar';
import TileSelectorModal from './TileSelectorModal';
import ObjectSelectorModal from './ObjectSelectorModal';

function Editor() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const tileDataRef = useRef(new Map());

  const [currentTool, setCurrentTool] = useState("tile");
  const [selectedTile, setSelectedTile] = useState("grass");
  const [selectedObject, setSelectedObject] = useState("character");
  const [movingTile, setMovingTile] = useState(null);
  const movingTilePosRef = useRef({ x: 0, y: 0 });
  const [showTileSelector, setShowTileSelector] = useState(false);
  const [showObjectSelector, setShowObjectSelector] = useState(false);

  const tileImageElements = useMemo(() => {
    const grass = new Image();
    grass.src = require('../../tiles/Grass.png');
    const wall = new Image();
    wall.src = require('../../tiles/Wall.png');
    const water = new Image();
    water.src = require('../../tiles/Water.png');
    return { grass, wall, water };
  }, []);

  const objectImageElements = useMemo(() => {
    const character = new Image();
    character.src = require('../../objects/Character.png');
    const door = new Image();
    door.src = require('../../objects/Door.png');
    const npc = new Image();
    npc.src = require('../../objects/Npc.png');
    return { character, door, npc };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Sidebar
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        selectedTile={selectedTile}
        setShowTileSelector={setShowTileSelector}
        selectedObject={selectedObject}
        setShowObjectSelector={setShowObjectSelector}
        tileDataRef={tileDataRef}
        tileImageElements={tileImageElements}
        objectImageElements={objectImageElements}
      />
      <Canvas
        offset={offset}
        setOffset={setOffset}
        offsetRef={offsetRef}
        tileDataRef={tileDataRef}
        currentTool={currentTool}
        selectedTile={selectedTile}
        selectedObject={selectedObject}
        movingTile={movingTile}
        setMovingTile={setMovingTile}
        movingTilePosRef={movingTilePosRef}
        tileImageElements={tileImageElements}
        objectImageElements={objectImageElements}
      />
      {showTileSelector && (
        <TileSelectorModal
          tileImageElements={tileImageElements}
          setSelectedTile={setSelectedTile}
          closeModal={() => setShowTileSelector(false)}
        />
      )}
      {showObjectSelector && (
        <ObjectSelectorModal
          objectImageElements={objectImageElements}
          setSelectedObject={setSelectedObject}
          closeModal={() => setShowObjectSelector(false)}
        />
      )}
    </div>
  );
}

export default Editor;
