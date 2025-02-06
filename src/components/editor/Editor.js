import React, { useRef, useState, useEffect, useMemo } from 'react';
import Canvas from './Canvas';
import Sidebar from './Sidebar';
import TileSelectorModal from './TileSelectorModal';
import ObjectSelectorModal from './ObjectSelectorModal';
import { tileMapping, objectMapping } from '../../utils/imageMapping';

function Editor() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const tileDataRef = useRef(new Map());

  const [currentTool, setCurrentTool] = useState("tile");
  const [selectedTile, setSelectedTile] = useState("grass");
  const [selectedObject, setSelectedObject] = useState("character");
  const [characterLocation, setCharacterLocation] = useState(null);
  const [movingTile, setMovingTile] = useState(null);
  const movingTilePosRef = useRef({ x: 0, y: 0 });
  const [showTileSelector, setShowTileSelector] = useState(false);
  const [showObjectSelector, setShowObjectSelector] = useState(false);

  const tileImageElements = useMemo(() => {
    const images = {};
    Object.keys(tileMapping).forEach(key => {
      const img = new Image();
      img.src = require(`../../tiles/${tileMapping[key]}`);
      images[key] = img;
    });
    return images;
  }, []);

  const objectImageElements = useMemo(() => {
    const images = {};
    Object.keys(objectMapping).forEach(key => {
      const img = new Image();
      img.src = require(`../../objects/${objectMapping[key]}`);
      images[key] = img;
    });
    return images;
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
        characterLocation={characterLocation}
        setCharacterLocation={setCharacterLocation}
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
