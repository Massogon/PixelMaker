import React, { useEffect, useRef } from 'react';
import {
  placeTileAt,
  placeObjectAt,
  deleteTileAt,
  moveTileAt
} from './editorHelpers';

const tileSize = 100;
const baseCoord = { x: 1000000000, y: 1000000000 };

function Canvas({
  offset,
  setOffset,
  offsetRef,
  tileDataRef,
  currentTool,
  selectedTile,
  selectedObject,
  movingTile,
  setMovingTile,
  movingTilePosRef,
  tileImageElements,
  objectImageElements,
}) {
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const isPlacing = useRef(false);
  const isDeleting = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const startTileI = Math.floor(-offset.x / tileSize);
      const startTileJ = Math.floor(-offset.y / tileSize);
      const endTileI = Math.ceil((canvas.width - offset.x) / tileSize);
      const endTileJ = Math.ceil((canvas.height - offset.y) / tileSize);
      for (let i = startTileI; i < endTileI; i++) {
        for (let j = startTileJ; j < endTileJ; j++) {
          const screenX = offset.x + i * tileSize;
          const screenY = offset.y + j * tileSize;
          const worldX = baseCoord.x + i;
          const worldY = baseCoord.y + j;
          let cellArray = null;
          if (tileDataRef.current.has(worldX)) {
            const innerMap = tileDataRef.current.get(worldX);
            if (innerMap.has(worldY)) {
              cellArray = innerMap.get(worldY);
            }
          }
          if (cellArray) {
            if (cellArray[0]) {
              if (tileImageElements[cellArray[0]]) {
                ctx.drawImage(tileImageElements[cellArray[0]], screenX, screenY, tileSize, tileSize);
              }
            } else {
              ctx.fillStyle = 'black';
              ctx.fillRect(screenX, screenY, tileSize, tileSize);
            }
            for (let k = 1; k < cellArray.length; k++) {
              const objType = cellArray[k];
              if (objType && objectImageElements[objType]) {
                ctx.drawImage(objectImageElements[objType], screenX, screenY, tileSize, tileSize);
              }
            }
          } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(screenX, screenY, tileSize, tileSize);
          }
          if (currentTool !== "cursor") {
            ctx.strokeStyle = 'lightgray';
            ctx.strokeRect(screenX, screenY, tileSize, tileSize);
          }
        }
      }

      if (movingTile) {
        const pos = movingTilePosRef.current;
        if (tileImageElements[movingTile.type]) {
          ctx.drawImage(tileImageElements[movingTile.type], pos.x - tileSize / 2, pos.y - tileSize / 2, tileSize, tileSize);
        } else if (objectImageElements[movingTile.type]) {
          ctx.drawImage(objectImageElements[movingTile.type], pos.x - tileSize / 2, pos.y - tileSize / 2, tileSize, tileSize);
        }
        ctx.strokeStyle = 'lightgray';
        ctx.strokeRect(pos.x - tileSize / 2, pos.y - tileSize / 2, tileSize, tileSize);
      }
      animationFrameId.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [offset, movingTile, tileImageElements, objectImageElements, currentTool, tileDataRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const preventContextMenu = e => e.preventDefault();
    canvas.addEventListener('contextmenu', preventContextMenu);
    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e) => {
      const pos = getMousePos(e);
      if (e.button === 2) {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      } else if (e.button === 0) {
        if (currentTool === "tile") {
          isPlacing.current = true;
          placeTileAt(pos, selectedTile, offsetRef.current, tileDataRef);
        } else if (currentTool === "object") {
          isPlacing.current = true;
          placeObjectAt(pos, selectedObject, offsetRef.current, tileDataRef);
        } else if (currentTool === "delete") {
          isDeleting.current = true;
          deleteTileAt(pos, offsetRef.current, tileDataRef);
        } else if (currentTool === "move") {
          const movedType = moveTileAt(pos, offsetRef.current, tileDataRef);
          if (movedType) {
            setMovingTile({ type: movedType });
            movingTilePosRef.current = pos;
          }
        }
      }
    };

    const handleMouseMove = (e) => {
      if (isDragging.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy };
        setOffset(offsetRef.current);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
      if (isPlacing.current && currentTool === "tile") {
        const pos = getMousePos(e);
        placeTileAt(pos, selectedTile, offsetRef.current, tileDataRef);
      }
      if (isPlacing.current && currentTool === "object") {
        const pos = getMousePos(e);
        placeObjectAt(pos, selectedObject, offsetRef.current, tileDataRef);
      }
      if (currentTool === "delete" && isDeleting.current) {
        const pos = getMousePos(e);
        deleteTileAt(pos, offsetRef.current, tileDataRef);
      }
      if (currentTool === "move" && movingTile) {
        const pos = getMousePos(e);
        movingTilePosRef.current = pos;
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 2) {
        isDragging.current = false;
      }
      if (e.button === 0) {
        if (currentTool === "tile" || currentTool === "object") {
          isPlacing.current = false;
        } else if (currentTool === "delete") {
          isDeleting.current = false;
        } else if (currentTool === "move" && movingTile) {
          const pos = getMousePos(e);
          if (movingTile.type in tileImageElements) {
            placeTileAt(pos, movingTile.type, offsetRef.current, tileDataRef);
          } else {
            placeObjectAt(pos, movingTile.type, offsetRef.current, tileDataRef);
          }
          setMovingTile(null);
        }
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      canvas.removeEventListener('contextmenu', preventContextMenu);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [currentTool, selectedTile, selectedObject, movingTile]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}

export default Canvas;
