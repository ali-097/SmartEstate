import React, { useEffect, useRef } from "react";

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      if (isOpen) {
        const constraints = {
          video: { facingMode: "environment" },
        };

        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        } catch (err) {
          console.error("Error accessing camera: ", err);
        }
      }
    };

    startCamera();
  }, [isOpen]);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
      } else {
        console.error("Failed to convert canvas to blob");
      }
      onClose();
    }, "image/png");
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-md">
          <video ref={videoRef} className="w-full transform scale-x-[-1]" />
          <button
            onClick={handleCapture}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Capture
          </button>
          <button
            onClick={onClose}
            className="mt-2 bg-red-500 text-white p-2 rounded"
          >
            Close
          </button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>
    )
  );
};

export default CameraModal;
