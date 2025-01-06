import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [barcode, setBarcode] = useState(null);

  const checkCameraPermissions = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { exact: "environment" } // Usar la cámara trasera (environment)
        }
      })
      .then(() => {
        setHasCameraPermission(true); 
      })
      .catch(() => {
        setHasCameraPermission(false); 
        setErrorMessage('Permiso para la cámara denegado.');
      });
  };

  const handleBarcodeScan = (data) => {
    if (data) {
      setBarcode(data.text);
    }
  };

  useEffect(() => {
    checkCameraPermissions();
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <h1>Inventario</h1>

      {/* Mostrar mensaje si hay un error o si el permiso está denegado */}
      {errorMessage && <p style={{ color: 'red' }}><strong>{errorMessage}</strong></p>}

      {/* Mostrar la cámara centrada */}
      {isCameraOpen && hasCameraPermission !== false && (
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
          <BarcodeScannerComponent
            width="100%"
            height="400px"
            onUpdate={(err, result) => handleBarcodeScan(result)}
            stopStream={false}
            onError={(err) => {
              console.error('Error al usar la cámara:', err);
              setErrorMessage('Error al usar la cámara.');
            }}
          />
        </div>
      )}

      {/* Mostrar el texto del código de barras si se detecta */}
      {barcode && <h1>¡Código Detectado: {barcode}</h1>}

      {/* Mostrar la imagen capturada */}
      {screenshot && (
        <div style={{ marginTop: '20px' }}>
          <h2>Imagen Capturada:</h2>
          <img src={screenshot} alt="Captura de cámara" style={{ width: '100%', maxWidth: '400px' }} />
        </div>
      )}
    </div>
  );
}

export default App;
