import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';

function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);  // Estado para controlar la apertura de la cámara
  const [errorMessage, setErrorMessage] = useState(null);    // Para mostrar errores si ocurren
  const [hasCameraPermission, setHasCameraPermission] = useState(null);  // Para verificar si el permiso ha sido concedido
  const [stream, setStream] = useState(null);  // Guardar el flujo de la cámara si es necesario
  const webcamRef = React.useRef(null);
  const [screenshot, setScreenshot] = useState(null);

  // Función para verificar si la cámara está disponible
  const checkCameraPermissions = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setHasCameraPermission(true);  // Permiso concedido
      })
      .catch(() => {
        setHasCameraPermission(false);  // Permiso denegado
        setErrorMessage('Permiso para la cámara denegado.');
      });
  };

  // Función para abrir la cámara
  const openCamera = () => {
    if (hasCameraPermission === false) {
      setErrorMessage('No se tiene permiso para acceder a la cámara.');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setStream(stream);
        setIsCameraOpen(true);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
        setErrorMessage('Error al acceder a la cámara.');
      });
  };

  // Función para cerrar la cámara
  const closeCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Detener todos los tracks de la cámara
    }
    setIsCameraOpen(false);
    setStream(null);
  };

  // Función para capturar la imagen
  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setScreenshot(imageSrc);
      } else {
        setErrorMessage('No se pudo capturar la imagen. Verifica que la cámara esté funcionando.');
      }
    }
  };

  useEffect(() => {
    checkCameraPermissions();
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>React Webcam App</h1>

      {/* Botón para abrir/cerrar la cámara */}
      <button onClick={isCameraOpen ? closeCamera : openCamera}>
        {isCameraOpen ? 'Cerrar Cámara' : 'Abrir Cámara'}
      </button>

      {/* Mostrar mensaje si hay un error o si el permiso está denegado */}
      {errorMessage && <p style={{ color: 'red' }}><strong>{errorMessage}</strong></p>}

      {/* Si la cámara está abierta, mostrar el componente Webcam */}
      {isCameraOpen && hasCameraPermission !== false && (
        <div style={{ margin: '20px 0' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              width: '100%',
              maxHeight: '400px',
              borderRadius: '10px',
              backgroundColor: 'black',
            }}
            onUserMediaError={(err) => {
              console.error('Error al usar la cámara:', err);
              setErrorMessage('Error al usar la cámara.');
            }}
          />
          <br />
          <button onClick={capture} style={{ marginTop: '10px' }}>
            Capturar Imagen
          </button>
        </div>
      )}

      {/* Diagnóstico de flujo de cámara */}
      {isCameraOpen && !errorMessage && (
        <p style={{ color: 'green', marginTop: '10px' }}>Cámara funcionando correctamente.</p>
      )}

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
