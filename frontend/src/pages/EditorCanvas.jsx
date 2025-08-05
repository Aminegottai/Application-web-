import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

function EditorCanvas({ onChange, onUpdate }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [bgMode, setBgMode] = useState('day');
  const [ambientMusic, setAmbientMusic] = useState('');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: '#ffffff',
      selection: true,
    });
    fabricRef.current = canvas;

    canvas.on('object:modified', () => {
      const json = canvas.toJSON();
      if (onChange) onChange(json);
    });

    canvas.on('object:removed', () => {
      const json = canvas.toJSON();
      if (onChange) onChange(json);
    });

    return () => canvas.dispose();
  }, [onChange]);

  const addElement = (type) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    let obj;
    if (type === 'chair') {
      obj = new fabric.Rect({ width: 60, height: 60, fill: '#a3e635', left: 100, top: 100 });
    } else if (type === 'light') {
      obj = new fabric.Circle({ radius: 30, fill: '#fcd34d', left: 150, top: 150 });
    } else if (type === 'flower') {
      obj = new fabric.Triangle({ width: 50, height: 50, fill: '#e879f9', left: 200, top: 100 });
    } else if (type === 'structure') {
      obj = new fabric.Rect({ width: 100, height: 20, fill: '#94a3b8', left: 100, top: 200 });
    } else if (type === 'fx') {
      obj = new fabric.Circle({ radius: 20, fill: '#ff6b6b', left: 180, top: 220 });
    }
    if (obj) {
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    const canvas = fabricRef.current;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
    }
  };

  const duplicateSelected = () => {
    const canvas = fabricRef.current;
    const active = canvas.getActiveObject();
    if (active) {
      active.clone((clone) => {
        clone.set({ left: active.left + 20, top: active.top + 20 });
        canvas.add(clone);
        canvas.setActiveObject(clone);
        canvas.renderAll();
      });
    }
  };

  const changeColor = () => {
    const canvas = fabricRef.current;
    const active = canvas.getActiveObject();
    if (active) {
      active.set('fill', '#' + Math.floor(Math.random() * 16777215).toString(16));
      canvas.renderAll();
    }
  };

  const toggleMode = () => {
    const canvas = fabricRef.current;
    const mode = bgMode === 'day' ? 'night' : 'day';
    setBgMode(mode);
    canvas.setBackgroundColor(mode === 'day' ? '#ffffff' : '#1e293b', canvas.renderAll.bind(canvas));
  };

  const handleMusicChange = (e) => {
    const music = e.target.value;
    setAmbientMusic(music);
    if (onUpdate) onUpdate({ ambientMusic: music });
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button onClick={() => addElement('chair')} style={styles.btn}>Chaise</button>
        <button onClick={() => addElement('light')} style={styles.btn}>Lumière</button>
        <button onClick={() => addElement('flower')} style={styles.btn}>Fleurs</button>
        <button onClick={() => addElement('structure')} style={styles.btn}>Structure</button>
        <button onClick={() => addElement('fx')} style={styles.btn}>Effets spéciaux</button>
        <button onClick={deleteSelected} style={styles.btn}>Supprimer</button>
        <button onClick={duplicateSelected} style={styles.btn}>Dupliquer</button>
        <button onClick={changeColor} style={styles.btn}>Couleur</button>
        <button onClick={toggleMode} style={styles.btn}>Mode {bgMode === 'day' ? 'Nuit' : 'Jour'}</button>
        <select value={ambientMusic} onChange={handleMusicChange} style={styles.select}>
          <option value="">Musique ambiance</option>
          <option value="piano">Piano</option>
          <option value="electronique">Électronique</option>
          <option value="nature">Nature</option>
        </select>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}

const styles = {
  btn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  select: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
  },
};

export default EditorCanvas;
