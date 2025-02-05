export const placeTileAt = (pos, type, currentOffset, tileDataRef, tileSize = 100, baseCoord = { x: 1000000000, y: 1000000000 }) => {
    const tileI = Math.floor((pos.x - currentOffset.x) / tileSize);
    const tileJ = Math.floor((pos.y - currentOffset.y) / tileSize);
    const worldX = baseCoord.x + tileI;
    const worldY = baseCoord.y + tileJ;
    if (!tileDataRef.current.has(worldX)) {
      tileDataRef.current.set(worldX, new Map());
    }
    const innerMap = tileDataRef.current.get(worldX);
    let cellArray;
    if (!innerMap.has(worldY)) {
      cellArray = [];
      innerMap.set(worldY, cellArray);
    } else {
      cellArray = innerMap.get(worldY);
    }
    cellArray[0] = type;
  };
  
  export const placeObjectAt = (pos, type, currentOffset, tileDataRef, tileSize = 100, baseCoord = { x: 1000000000, y: 1000000000 }) => {
    if (type === "character") {
      for (const innerMap of tileDataRef.current.values()) {
        for (const cellArray of innerMap.values()) {
          for (let i = 1; i < cellArray.length; i++) {
            if (cellArray[i] === "character") {
              return;
            }
          }
        }
      }
    } else {
      const tileI = Math.floor((pos.x - currentOffset.x) / tileSize);
      const tileJ = Math.floor((pos.y - currentOffset.y) / tileSize);
      const worldX = baseCoord.x + tileI;
      const worldY = baseCoord.y + tileJ;
      let cellArray;
      if (!tileDataRef.current.has(worldX)) {
        tileDataRef.current.set(worldX, new Map());
      }
      const innerMap = tileDataRef.current.get(worldX);
      if (!innerMap.has(worldY)) {
        cellArray = [];
        innerMap.set(worldY, cellArray);
      } else {
        cellArray = innerMap.get(worldY);
      }
      if (cellArray.length === 0) {
        cellArray[0] = undefined;
      }
      if (cellArray.slice(1).includes(type)) return;
      cellArray.push(type);
      return;
    }
    const tileI = Math.floor((pos.x - currentOffset.x) / tileSize);
    const tileJ = Math.floor((pos.y - currentOffset.y) / tileSize);
    const worldX = baseCoord.x + tileI;
    const worldY = baseCoord.y + tileJ;
    let cellArray;
    if (!tileDataRef.current.has(worldX)) {
      tileDataRef.current.set(worldX, new Map());
    }
    const innerMap = tileDataRef.current.get(worldX);
    if (!innerMap.has(worldY)) {
      cellArray = [];
      innerMap.set(worldY, cellArray);
    } else {
      cellArray = innerMap.get(worldY);
    }
    if (cellArray.length === 0) {
      cellArray[0] = undefined;
    }
    cellArray.push(type);
  };
  
  export const deleteTileAt = (pos, currentOffset, tileDataRef, tileSize = 100, baseCoord = { x: 1000000000, y: 1000000000 }) => {
    const tileI = Math.floor((pos.x - currentOffset.x) / tileSize);
    const tileJ = Math.floor((pos.y - currentOffset.y) / tileSize);
    const worldX = baseCoord.x + tileI;
    const worldY = baseCoord.y + tileJ;
    if (tileDataRef.current.has(worldX)) {
      const innerMap = tileDataRef.current.get(worldX);
      if (innerMap.has(worldY)) {
        innerMap.delete(worldY);
        if (innerMap.size === 0) {
          tileDataRef.current.delete(worldX);
        }
      }
    }
  };
  
  export const moveTileAt = (pos, currentOffset, tileDataRef, tileSize = 100, baseCoord = { x: 1000000000, y: 1000000000 }) => {
    const tileI = Math.floor((pos.x - currentOffset.x) / tileSize);
    const tileJ = Math.floor((pos.y - currentOffset.y) / tileSize);
    const worldX = baseCoord.x + tileI;
    const worldY = baseCoord.y + tileJ;
    if (tileDataRef.current.has(worldX)) {
      const innerMap = tileDataRef.current.get(worldX);
      if (innerMap.has(worldY)) {
        let cellArray = innerMap.get(worldY);
        if (cellArray && cellArray.length > 0) {
          let indexToMove = cellArray.length > 1 ? cellArray.length - 1 : 0;
          const typeToMove = cellArray[indexToMove];
          cellArray.splice(indexToMove, 1);
          if (cellArray.length === 0 || (cellArray.length === 1 && cellArray[0] === undefined)) {
            innerMap.delete(worldY);
            if (innerMap.size === 0) {
              tileDataRef.current.delete(worldX);
            }
          }
          return typeToMove;
        }
      }
    }
    return null;
  };
  