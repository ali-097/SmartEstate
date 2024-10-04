const ImageModal = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  setCurrentIndex,
  viewButtons,
}) => {
  if (!isOpen) return null;

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 p-4">
      <div className="relative max-w-3xl w-full bg-white rounded-lg overflow-hidden shadow-xl transition-transform transform-gpu">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-auto rounded-t-lg"
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-500 transition duration-200 shadow-lg flex items-center justify-center border border-white"
          aria-label="Close Modal"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {viewButtons && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-between w-full max-w-xs space-x-4 z-50 p-4">
            <button
              onClick={prevImage}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 shadow-md transform hover:scale-105"
              aria-label="Previous Image"
            >
              &lt; Previous
            </button>

            <button
              onClick={nextImage}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 shadow-md transform hover:scale-105"
              aria-label="Next Image"
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
