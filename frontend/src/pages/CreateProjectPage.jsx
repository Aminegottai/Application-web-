import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fabric } from 'fabric';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function CreateProjectPage() {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    client: '',
    eventType: '',
    preferredStyle: '',
    template: '',
    is3D: false,
    dimensions: { width: 10, length: 10, height: 3 },
    elements: [],
    music: '',
    isNight: false,
    notes: '',
    date: '',
    location: '',
    placeImage: null,
  });
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const [history, setHistory] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [annotationType, setAnnotationType] = useState('text');

  useEffect(() => {
    console.log('useEffect déclenché pour l\'étape', step);
    if (step === 3 && !canvasInstance.current) {
      console.log('Initialisation du canevas...');
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        width: projectData.dimensions.width * 100,
        height: projectData.dimensions.length * 100,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
      });
      console.log('Canevas initialisé avec succès :', canvasInstance.current);

      canvasInstance.current.on('object:modified', () => {
        console.log('Objet modifié, état sauvegardé');
        saveState();
      });
      canvasInstance.current.on('object:added', () => {
        console.log('Objet ajouté, état sauvegardé');
        saveState();
      });
      canvasInstance.current.on('object:removed', () => {
        console.log('Objet supprimé, état sauvegardé');
        saveState();
      });
      canvasInstance.current.on('selection:created', (e) => {
        console.log('Objet sélectionné :', e.target);
        setSelectedObject(e.target);
      });
      canvasInstance.current.on('selection:cleared', () => {
        console.log('Sélection annulée');
        setSelectedObject(null);
      });

      if (projectData.placeImage) {
        fabric.Image.fromURL(projectData.placeImage, (img) => {
          img.set({ originX: 'center', originY: 'center', left: canvasInstance.current.width / 2, top: canvasInstance.current.height / 2 });
          canvasInstance.current.add(img);
          canvasInstance.current.sendToBack(img);
          saveState();
        });
      }
    } else if (step !== 3 && canvasInstance.current) {
      console.log('Nettoyage du canevas pour une autre étape');
      canvasInstance.current.dispose();
      canvasInstance.current = null;
    }
    return () => {
      if (canvasInstance.current) {
        console.log('Nettoyage final du canevas');
        canvasInstance.current.dispose();
      }
    };
  }, [step, projectData.dimensions.width, projectData.dimensions.length, projectData.placeImage]);

  const saveState = () => {
    if (canvasInstance.current) {
      console.log('Sauvegarde de l\'état actuel du canevas');
      setHistory([...history, canvasInstance.current.toJSON()]);
    } else {
      console.log('Erreur : canevas non disponible pour sauvegarde');
    }
  };

  const undo = () => {
    if (history.length > 1) {
      console.log('Annulation, chargement de l\'état précédent');
      const prevState = history[history.length - 2];
      canvasInstance.current.loadFromJSON(prevState, () => {
        console.log('État précédent chargé');
        canvasInstance.current.renderAll();
      });
      setHistory(history.slice(0, -1));
    } else {
      console.log('Aucun état précédent disponible');
    }
  };

  const redo = () => {
    if (history.length < canvasInstance.current?.toJSON().objects.length + 1) {
      console.log('Rétablissement, chargement de l\'état suivant');
      const nextState = [...history, canvasInstance.current.toJSON()];
      canvasInstance.current.loadFromJSON(nextState[nextState.length - 1], () => {
        console.log('État suivant chargé');
        canvasInstance.current.renderAll();
      });
      setHistory(nextState);
    } else {
      console.log('Aucun état suivant disponible');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('Changement d\'entrée :', name, value, type, checked);
    setProjectData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'isNight' && canvasInstance.current) {
      console.log('Mode nuit activé/désactivé');
      applyNightMode();
    }
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    console.log('Changement de dimension :', name, value);
    setProjectData((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [name]: parseFloat(value) || 0 },
    }));
    if (canvasInstance.current) {
      console.log('Mise à jour des dimensions du canevas :', value * 100, projectData.dimensions.length * 100);
      canvasInstance.current.setDimensions({
        width: value * 100,
        height: projectData.dimensions.length * 100,
      });
      canvasInstance.current.renderAll();
    }
  };

  const handlePlaceImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Upload d\'image de lieu :', file.name);
      const url = URL.createObjectURL(file);
      setProjectData((prev) => ({ ...prev, placeImage: url }));
    }
  };

  const addElement = (subItem) => {
    console.log('Tentative d\'ajout de l\'élément :', subItem);
    if (!canvasInstance.current) {
      console.log('Erreur : canevas non initialisé');
      return;
    }

    const elementImages = {
      chaise: 'https://fr.freepik.com/psd-gratuit/chaise-bois-rustique-design-classique_409090114.htm#fromView=search&page=1&position=7&uuid=ad3b73bd-0507-40eb-998e-afa7f726b1dc&query=chaise',
      table: 'https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      spot: 'https://images.pexels.com/photos/1049292/pexels-photo-1049292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      projecteur: 'https://images.pexels.com/photos/1592980/pexels-photo-1592980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bouquet: 'https://images.pexels.com/photos/1005413/pexels-photo-1005413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      guirlande: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      podium: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      scène: 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      fumée: 'https://images.pexels.com/photos/21014/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      feu: 'https://images.pexels.com/photos/288963/pexels-photo-288963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    };

    const url = elementImages[subItem.toLowerCase()];
    console.log('URL de l\'image à charger :', url);

    fabric.Image.fromURL(url, (img) => {
      console.log('Image chargée avec succès :', img);
      img.set({ left: 50, top: 50, scaleX: 0.5, scaleY: 0.5, selectable: true, hasControls: true });
      if (canvasInstance.current) {
        console.log('Ajout de l\'image au canevas');
        canvasInstance.current.add(img);
        saveState();
      }
    }, {
      onError: (err) => {
        console.error('Erreur lors du chargement de l\'image :', err);
      }
    });

    console.log('Fin de la tentative d\'ajout, catégorie fermée');
    setActiveCategory(null);
  };

  const addAnnotation = () => {
    if (!canvasInstance.current) {
      console.log('Erreur : canevas non initialisé');
      return;
    }
    if (annotationType === 'text' && textInput) {
      const text = new fabric.Text(textInput, {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: '#000000',
        selectable: true,
        hasControls: true,
      });
      canvasInstance.current.add(text);
      saveState();
    } else if (annotationType === 'logo') {
      const logoUrl = 'https://via.placeholder.com/50'; // Remplace par une URL de logo réelle
      fabric.Image.fromURL(logoUrl, (img) => {
        img.set({ left: 50, top: 50, scaleX: 0.5, scaleY: 0.5, selectable: true, hasControls: true });
        canvasInstance.current.add(img);
        saveState();
      }, {
        onError: (err) => console.error('Erreur logo :', err),
      });
    }
    setTextInput('');
  };

  const duplicateSelected = () => {
    if (selectedObject && canvasInstance.current) {
      console.log('Duplication de l\'objet sélectionné');
      const clone = fabric.util.object.clone(selectedObject);
      clone.set({ left: selectedObject.left + 10, top: selectedObject.top + 10 });
      canvasInstance.current.add(clone);
      saveState();
    } else {
      console.log('Erreur : aucun objet sélectionné ou canevas non disponible');
    }
  };

  const deleteSelected = () => {
    if (selectedObject && canvasInstance.current) {
      console.log('Suppression de l\'objet sélectionné :', selectedObject);
      canvasInstance.current.remove(selectedObject);
      setSelectedObject(null);
      saveState();
    } else {
      console.log('Erreur : aucun objet sélectionné ou canevas non disponible');
    }
  };

  const zoomIn = () => {
    if (canvasInstance.current) {
      console.log('Zoom avant');
      canvasInstance.current.zoomToPoint({ x: canvasInstance.current.width / 2, y: canvasInstance.current.height / 2 }, canvasInstance.current.getZoom() * 1.1);
    } else {
      console.log('Erreur : canevas non disponible pour zoom');
    }
  };

  const zoomOut = () => {
    if (canvasInstance.current) {
      console.log('Zoom arrière');
      canvasInstance.current.zoomToPoint({ x: canvasInstance.current.width / 2, y: canvasInstance.current.height / 2 }, canvasInstance.current.getZoom() / 1.1);
    } else {
      console.log('Erreur : canevas non disponible pour zoom');
    }
  };

  const bringToFront = () => {
    if (selectedObject && canvasInstance.current) {
      console.log('Déplacement de l\'objet au premier plan');
      selectedObject.bringToFront();
      canvasInstance.current.renderAll();
      saveState();
    } else {
      console.log('Erreur : aucun objet sélectionné ou canevas non disponible');
    }
  };

  const sendToBack = () => {
    if (selectedObject && canvasInstance.current) {
      console.log('Déplacement de l\'objet au dernier plan');
      selectedObject.sendToBack();
      canvasInstance.current.renderAll();
      saveState();
    } else {
      console.log('Erreur : aucun objet sélectionné ou canevas non disponible');
    }
  };

  const applyTexture = (textureUrl) => {
    if (selectedObject && canvasInstance.current) {
      console.log('Application de la texture :', textureUrl);
      fabric.Image.fromURL(textureUrl, (img) => {
        console.log('Texture chargée :', img);
        img.scaleToWidth(selectedObject.width * selectedObject.scaleX);
        selectedObject.set('fill', new fabric.Pattern({ source: img.getElement(), repeat: 'repeat' }));
        canvasInstance.current.renderAll();
        saveState();
      }, {
        onError: (err) => {
          console.error('Erreur lors du chargement de la texture :', err);
        }
      });
    } else {
      console.log('Erreur : aucun objet sélectionné ou canevas non disponible');
    }
  };

  const applyNightMode = () => {
    if (canvasInstance.current) {
      console.log('Application du mode nuit :', projectData.isNight);
      if (projectData.isNight) {
        canvasInstance.current.backgroundColor = '#1e293b';
        canvasInstance.current.forEachObject((obj) => {
          obj.set('opacity', 0.7);
        });
      } else {
        canvasInstance.current.backgroundColor = '#ffffff';
        canvasInstance.current.forEachObject((obj) => {
          obj.set('opacity', 1);
        });
      }
      canvasInstance.current.renderAll();
    } else {
      console.log('Erreur : canevas non disponible pour le mode nuit');
    }
  };

  const exportPDF = () => {
    if (canvasInstance.current) {
      console.log('Exportation en PDF...');
      html2canvas(canvasRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`${projectData.name}_project.pdf`);
      });
    } else {
      console.log('Erreur : canevas non disponible pour export');
    }
  };

  const handleNext = () => {
    console.log('Passage à l\'étape suivante :', step + 1);
    if (step === 3) applyNightMode();
    setStep(step + 1);
  };
  const handlePrev = () => {
    console.log('Retour à l\'étape précédente :', step - 1);
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={styles.stepContainer}>
            <h2 style={styles.stepTitle}>Étape 1 : Informations générales</h2>
            <div style={styles.formGroup}>
              <input
                name="name"
                placeholder="Nom du projet"
                value={projectData.name}
                onChange={handleInputChange}
                style={styles.input}
              />
              <select name="client" value={projectData.client} onChange={handleInputChange} style={styles.input}>
                <option value="">Sélectionner un client</option>
                <option value="new">Nouveau client</option>
                <option value="client1">Client 1</option>
              </select>
              <select name="eventType" value={projectData.eventType} onChange={handleInputChange} style={styles.input}>
                <option value="">Type d'événement</option>
                <option value="mariage">Mariage</option>
                <option value="concert">Concert</option>
              </select>
              <input
                name="preferredStyle"
                placeholder="Style préféré (optionnel)"
                value={projectData.preferredStyle}
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                name="date"
                type="date"
                value={projectData.date}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <button onClick={handleNext} style={styles.buttonPrimary}>Suivant</button>
          </div>
        );
      case 2:
        return (
          <div style={styles.stepContainer}>
            <h2 style={styles.stepTitle}>Étape 2 : Planification & espace</h2>
            <div style={styles.formGroup}>
              <select name="template" value={projectData.template} onChange={handleInputChange} style={styles.input}>
                <option value="">Choisir un gabarit</option>
                <option value="salle">Salle vide</option>
                <option value="jardin">Jardin</option>
                <option value="scene">Scène</option>
              </select>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" name="is3D" checked={projectData.is3D} onChange={handleInputChange} />
                2D/3D
              </label>
              <input
                name="width"
                type="number"
                value={projectData.dimensions.width}
                onChange={handleDimensionChange}
                placeholder="Largeur (m)"
                style={styles.input}
              />
              <input
                name="length"
                type="number"
                value={projectData.dimensions.length}
                onChange={handleDimensionChange}
                placeholder="Longueur (m)"
                style={styles.input}
              />
              <input
                name="height"
                type="number"
                value={projectData.dimensions.height}
                onChange={handleDimensionChange}
                placeholder="Hauteur (m)"
                style={styles.input}
              />
              <select name="location" value={projectData.location} onChange={handleInputChange} style={styles.input}>
                <option value="">Sélectionner un lieu</option>
                <option value="salle1">Salle 1</option>
                <option value="jardin1">Jardin 1</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={handlePlaceImageUpload}
                style={styles.input}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={handleNext} style={styles.buttonPrimary}>Suivant</button>
              <button onClick={handlePrev} style={styles.buttonSecondary}>Précédent</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={styles.stepContainer}>
            <h2 style={styles.stepTitle}>Étape 3 : Scénographie</h2>
            <div style={styles.editorLayout}>
              <div style={styles.toolbar}>
                <button onClick={undo} style={styles.toolButton} disabled={history.length <= 1}>Annuler</button>
                <button onClick={redo} style={styles.toolButton} disabled={history.length >= canvasInstance.current?.toJSON().objects.length + 1}>Refaire</button>
                <button onClick={zoomIn} style={styles.toolButton}>Zoom +</button>
                <button onClick={zoomOut} style={styles.toolButton}>Zoom -</button>
                <button onClick={deleteSelected} style={styles.toolButton} disabled={!selectedObject}>Supprimer</button>
                <button onClick={duplicateSelected} style={styles.toolButton} disabled={!selectedObject}>Dupliquer</button>
                <button onClick={bringToFront} style={styles.toolButton} disabled={!selectedObject}>Devant</button>
                <button onClick={sendToBack} style={styles.toolButton} disabled={!selectedObject}>Derrière</button>
                <button onClick={() => setAnnotationType('text')} style={styles.toolButton}>Ajouter texte</button>
                <button onClick={() => setAnnotationType('logo')} style={styles.toolButton}>Ajouter logo</button>
              </div>
              <div style={styles.canvasContainer}>
                <canvas ref={canvasRef} style={styles.canvas} />
              </div>
              <div style={styles.toolPanel}>
                <h3 style={styles.panelTitle}>Bibliothèque</h3>
                <div style={styles.categoryList}>
                  {['Mobilier', 'Lumière', 'Fleurs / décos', 'Structure', 'Effets spéciaux'].map((category) => (
                    <div key={category}>
                      <button
                        onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                        style={styles.categoryButton}
                      >
                        {category}
                      </button>
                      {activeCategory === category && (
                        <div style={styles.subMenu}>
                          {category === 'Mobilier' && (
                            <>
                              <button onClick={() => addElement('chaise')} style={styles.subButton}>Chaise</button>
                              <button onClick={() => addElement('table')} style={styles.subButton}>Table</button>
                            </>
                          )}
                          {category === 'Lumière' && (
                            <>
                              <button onClick={() => addElement('spot')} style={styles.subButton}>Spot</button>
                              <button onClick={() => addElement('projecteur')} style={styles.subButton}>Projecteur</button>
                            </>
                          )}
                          {category === 'Fleurs / décos' && (
                            <>
                              <button onClick={() => addElement('bouquet')} style={styles.subButton}>Bouquet</button>
                              <button onClick={() => addElement('guirlande')} style={styles.subButton}>Guirlande</button>
                            </>
                          )}
                          {category === 'Structure' && (
                            <>
                              <button onClick={() => addElement('podium')} style={styles.subButton}>Podium</button>
                              <button onClick={() => addElement('scène')} style={styles.subButton}>Scène</button>
                            </>
                          )}
                          {category === 'Effets spéciaux' && (
                            <>
                              <button onClick={() => addElement('fumée')} style={styles.subButton}>Fumée</button>
                              <button onClick={() => addElement('feu')} style={styles.subButton}>Feu</button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {annotationType && (
                  <div style={styles.annotationPanel}>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={annotationType === 'text' ? 'Texte...' : 'URL logo...'}
                      style={styles.input}
                    />
                    <button onClick={addAnnotation} style={styles.buttonPrimary}>Ajouter</button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      console.log('Fichier sélectionné pour upload :', file.name);
                      const url = URL.createObjectURL(file);
                      addImage(url);
                    }
                  }}
                  style={styles.input}
                />
                {selectedObject && (
                  <div style={styles.propertyPanel}>
                    <h4 style={styles.panelTitle}>Propriétés</h4>
                    <input
                      type="color"
                      value={selectedObject.fill || '#000000'}
                      onChange={(e) => {
                        console.log('Changement de couleur :', e.target.value);
                        updateObjectProperty('fill', e.target.value);
                      }}
                      style={styles.colorInput}
                    />
                    <select onChange={(e) => applyTexture(e.target.value)} style={styles.input}>
                      <option value="">Choisir texture</option>
                      <option value="https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1">Bois</option>
                      <option value="https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1">Tissu</option>
                    </select>
                    <input
                      type="number"
                      value={selectedObject.angle || 0}
                      onChange={(e) => {
                        console.log('Changement de rotation :', e.target.value);
                        updateObjectProperty('angle', parseInt(e.target.value));
                      }}
                      placeholder="Rotation (°)"
                      style={styles.input}
                    />
                    <input
                      type="number"
                      value={selectedObject.scaleX * 100 || 100}
                      onChange={(e) => {
                        const scale = parseInt(e.target.value) / 100;
                        updateObjectProperty('scaleX', scale);
                        updateObjectProperty('scaleY', scale);
                      }}
                      placeholder="Taille (%)"
                      style={styles.input}
                    />
                  </div>
                )}
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isNight"
                    checked={projectData.isNight}
                    onChange={handleInputChange}
                  /> Mode nuit
                </label>
                <input
                  name="music"
                  placeholder="URL musique ou son"
                  value={projectData.music}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={handleNext} style={styles.buttonPrimary}>Suivant</button>
              <button onClick={handlePrev} style={styles.buttonSecondary}>Précédent</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={styles.stepContainer}>
            <h2 style={styles.stepTitle}>Étape 4 : Présentation</h2>
            <div style={styles.previewContainer}>
              <canvas ref={canvasRef} style={styles.canvas} />
            </div>
            <div style={styles.formGroup}>
              <textarea
                name="notes"
                placeholder="Notes/commentaires"
                value={projectData.notes}
                onChange={handleInputChange}
                style={styles.textarea}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => {
                  if (canvasInstance.current) {
                    console.log('Capture de l\'image PNG');
                    const dataURL = canvasInstance.current.toDataURL();
                    const link = document.createElement('a');
                    link.href = dataURL;
                    link.download = `${projectData.name}_preview.png`;
                    link.click();
                  } else {
                    console.log('Erreur : canevas non disponible pour capture');
                  }
                }}
                style={styles.buttonPrimary}
              >
                Capturer (PNG)
              </button>
              <button onClick={exportPDF} style={styles.buttonPrimary}>Exporter PDF</button>
              <button style={styles.buttonSecondary}>Exporter Vidéo</button>
              <button style={styles.buttonSecondary}>Générer lien partageable</button>
            </div>
            <Link to="/dashboard" style={styles.buttonSecondary}>Retour au dashboard</Link>
          </div>
        );
      default:
        return <div>Étape invalide</div>;
    }
  };

  const updateObjectProperty = (property, value) => {
    if (selectedObject && canvasInstance.current) {
      console.log('Mise à jour de la propriété :', property, value);
      selectedObject.set(property, value);
      canvasInstance.current.renderAll();
      saveState();
    } else {
      console.log('Erreur : aucun objet sélectionné ou canevas non disponible');
    }
  };

  const addImage = (url) => {
    console.log('Ajout d\'une image uploadée :', url);
    fabric.Image.fromURL(url, (img) => {
      console.log('Image uploadée chargée :', img);
      img.set({ left: 50, top: 50, scaleX: 0.5, scaleY: 0.5, selectable: true, hasControls: true });
      if (canvasInstance.current) {
        console.log('Ajout de l\'image au canevas');
        canvasInstance.current.add(img);
        saveState();
      }
    }, {
      onError: (err) => {
        console.error('Erreur lors du chargement de l\'image uploadée :', err);
      }
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.progressBar}>
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            style={{
              ...styles.progressStep,
              backgroundColor: step >= s ? '#6366f1' : '#e2e8f0',
            }}
          />
        ))}
      </div>
      <h1 style={styles.title}>Créer / Gérer un projet</h1>
      {renderStep()}
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem',
    fontFamily: 'Inter, sans-serif',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '2.5rem',
  },
  progressStep: {
    width: '20%',
    height: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  stepContainer: {
    padding: '2.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    marginBottom: '2rem',
  },
  stepTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  formGroup: {
    display: 'grid',
    gap: '1.2rem',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.7rem',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.7rem',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '120px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  editorLayout: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gap: '2rem',
    marginBottom: '2rem',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  canvasContainer: {
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden',
    position: 'relative',
    background: '#fff',
  },
  canvas: {
    width: '100%',
    height: 'auto',
  },
  toolPanel: {
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    maxHeight: '450px',
    overflowY: 'auto',
  },
  panelTitle: {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: '1rem',
  },
  categoryList: {
    marginBottom: '1rem',
  },
  categoryButton: {
    backgroundColor: '#6366f1',
    color: '#fff',
    padding: '0.4rem 0.8rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '0.3rem',
    width: '100%',
    fontSize: '0.9rem',
    transition: 'background 0.3s ease',
  },
  subMenu: {
    marginLeft: '0.8rem',
    marginTop: '0.3rem',
  },
  subButton: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: '0.3rem 0.6rem',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginBottom: '0.3rem',
    width: '100%',
    fontSize: '0.8rem',
    transition: 'background 0.3s ease',
  },
  propertyPanel: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#edf2f7',
    borderRadius: '4px',
  },
  colorInput: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '0.5rem',
  },
  annotationPanel: {
    marginBottom: '1rem',
    display: 'flex',
    gap: '0.5rem',
  },
  previewContainer: {
    marginBottom: '2rem',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  buttonPrimary: {
    backgroundColor: '#6366f1',
    color: '#fff',
    padding: '0.7rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  buttonSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    padding: '0.7rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};

export default CreateProjectPage;