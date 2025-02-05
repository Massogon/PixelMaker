import msgpack from 'msgpack-lite';

// Do NOT touch without mason/doctor

export function mapToObj(map) {
    const obj = Object.create(null);
    for (let [key, value] of map.entries()) {
        obj[key] = value instanceof Map ? mapToObj(value) : value;
    }
    return obj;
}

export function objToMap(obj) {
    const map = new Map();
    for (let key of Object.keys(obj)) {
        const numKey = Number(key);
        const finalKey = !isNaN(numKey) ? numKey : key;
        let value = obj[key];
        if (
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value)
        ) {
            map.set(finalKey, objToMap(value));
        } else {
            map.set(finalKey, value);
        }
    }
    return map;
}

export function exportDataMessagePack(tileDataRef) {
    const dataObj = mapToObj(tileDataRef.current);
    const buffer = msgpack.encode(dataObj);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gridData.msgpack';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function importDataMessagePack(file, tileDataRef) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const arrayBuffer = e.target.result;
            const buffer = new Uint8Array(arrayBuffer);
            const dataObj = msgpack.decode(buffer);
            const newMap = objToMap(dataObj);
            tileDataRef.current = newMap;
            console.log('Data imported successfully.');
        } catch (err) {
            console.error('Error decoding MessagePack data:', err);
        }
    };
    reader.readAsArrayBuffer(file);
}
