import { useState } from "react";
import Helmet from "../components/Helmet";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CameraModal from "../components/CameraModal";
import MapComponent from "../components/MapComponent";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    verified: true,
    time: "",
    location: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [verifiedWarning, setVerifiedWarning] = useState({
    warningDisplayed: false,
    showUpload: false,
  });
  const [address, setAddress] = useState({
    house: "",
    street: "",
    area: "",
    city: "",
  });
  const cities = ["Islamabad", "Lahore", "Karachi"];

  const handleOpenCamera = () => {
    setCameraOpen(true);
  };
  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  const handleCaptureImage = async (blob) => {
    const file = new File([blob], "photo.png", { type: "image/png" });
    setFiles((prevFiles) => [...prevFiles, file]);
    setCapturedImages((prevImages) => [
      ...prevImages,
      URL.createObjectURL(file),
    ]);
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setCapturedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.verified) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData((prevData) => ({
              ...prevData,
              location: `${position.coords.latitude},${position.coords.longitude}`,
              time: new Date().toISOString().split("T")[0],
            }));
            submitForm({
              ...formData,
              location: `${position.coords.latitude},${position.coords.longitude}`,
              time: new Date().toISOString().split("T")[0],
            });
          },
          (error) => {
            setError("Unable to retrieve location");
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    } else {
      submitForm(formData);
    }
  };

  const submitForm = async (formDataToSubmit) => {
    try {
      if (files.length + formDataToSubmit.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formDataToSubmit.regularPrice < +formDataToSubmit.discountPrice)
        return setError("Discount price must be lower than regular price");
      if (files.length + formDataToSubmit.imageUrls.length > 10)
        return setError("You can only upload 10 images per listing");
      if (files.some((file) => file.size > 2 * 1024 * 1024))
        return setError("Image upload failed (2 mb max per image)");
      if (formDataToSubmit.location === "")
        return setError("Please set your property location");

      setLoading(true);
      setError(false);
      const imageUploadPromises = [];

      for (const file of files) {
        imageUploadPromises.push(storeImage(file));
      }

      for (const url of formDataToSubmit.imageUrls) {
        const file = await fetch(url).then((res) => res.blob());
        imageUploadPromises.push(storeImage(file));
      }

      const urls = await Promise.all(imageUploadPromises);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formDataToSubmit,
          imageUrls: urls,
          userRef: currentUser._id,
          address: `House No: ${address.house}, Street No: ${address.street}, ${address.area}, ${address.city}`,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Helmet title={"Create Listing"}>
      <section className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create Listing
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col lg:w-6/12">
              <div className="mt-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div>
                  <input
                    type="text"
                    id="name"
                    maxLength="62"
                    minLength="10"
                    required
                    onChange={handleChange}
                    value={formData.name}
                    className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div>
                  <textarea
                    type="text"
                    id="description"
                    required
                    onChange={handleChange}
                    value={formData.description}
                    className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="flex flex-wrap">
                  <div className="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
                    <input
                      type="text"
                      id="house"
                      required
                      onChange={(e) =>
                        setAddress({ ...address, house: e.target.value })
                      }
                      value={address.house}
                      placeholder="House"
                      className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="w-full sm:w-1/2 px-2">
                    <input
                      type="text"
                      id="street"
                      required
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      value={address.street}
                      placeholder="Street"
                      className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap mt-4">
                  <div className="w-full sm:w-3/5 px-2 mb-4 sm:mb-0">
                    <input
                      type="text"
                      id="area"
                      required
                      onChange={(e) =>
                        setAddress({ ...address, area: e.target.value })
                      }
                      value={address.area}
                      placeholder="Area"
                      className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="w-full sm:w-2/5 px-2 mb-4 relative">
                    <select
                      id="city"
                      required
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      value={address.city}
                      className="block w-full rounded-lg border border-gray-300 bg-white shadow-sm py-2.5 px-4 text-gray-900 placeholder:text-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                    >
                      <option value="" disabled>
                        Select a city
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sale"
                    onChange={handleChange}
                    checked={formData.type === "sale"}
                    className="block rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span>Sale</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rent"
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                    className="block rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span>Rental</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    onChange={handleChange}
                    checked={formData.furnished}
                    className="block rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span>Furnished</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="offer"
                    onChange={handleChange}
                    checked={formData.offer}
                    className="block rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span>Offer</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    onChange={handleChange}
                    checked={formData.parking}
                    className="block rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span>Parking spot</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    required
                    onChange={handleChange}
                    value={formData.bedrooms}
                    className="block rounded-md border-0 outline-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span>Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="10"
                    required
                    onChange={handleChange}
                    value={formData.bathrooms}
                    className="block rounded-md border-0 outline-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span>Bathrooms</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="regularPrice"
                      min="50"
                      required
                      onChange={handleChange}
                      value={formData.regularPrice}
                      className="block rounded-md border-0 outline-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <div className="flex flex-col items-center">
                      <p>Regular price</p>
                      {formData.type === "rent" && (
                        <span className="text-xs">(Rs / month)</span>
                      )}
                    </div>
                  </div>
                </div>
                {formData.offer && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id="discountPrice"
                        min="0"
                        required
                        onChange={handleChange}
                        value={formData.discountPrice}
                        className="block rounded-md border-0 outline-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="flex flex-col items-center">
                        <p>Discount price</p>
                        {formData.type === "rent" && (
                          <span className="text-xs">(Rs / month)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {verifiedWarning.showUpload && (
                <div className="mt-6 bg-white rounded-lg p-6 shadow-md border border-gray-200">
                  <h3 className="text-2xl font-bold text-grey-700 mb-3">
                    Set Your Property Location
                  </h3>
                  <div className="flex items-center mb-3">
                    <span className="text-lg text-gray-700 mr-2">📍</span>
                    <span className="text-md text-gray-600">
                      Click on the map to mark your property. Drag the marker to
                      adjust.
                    </span>
                  </div>
                  <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 shadow-lg">
                    <MapComponent onLocationSelect={handleLocationSelect} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Use zoom and pan for precise placement.
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col p-2 items-center justify-center bg-gray-50 rounded-md lg:w-6/12">
              <p className="font-semibold">
                Images:
                <span className="text-gray-600 ml-2">
                  The first image will be the cover (max 6)
                </span>
              </p>
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  onClick={handleOpenCamera}
                  className="p-2 text-blue-700 border border-blue-700 rounded uppercase hover:shadow-lg"
                >
                  Take a Picture
                </button>
                <button
                  type="button"
                  className={`${
                    verifiedWarning.showUpload ? "hidden" : "block"
                  } p-2 text-blue-700 border border-blue-700 rounded uppercase hover:shadow-lg 
                  `}
                  onClick={() =>
                    setVerifiedWarning({
                      warningDisplayed: true,
                    })
                  }
                >
                  Upload Image
                </button>
                <input
                  className={`${
                    verifiedWarning.showUpload ? "block" : "hidden"
                  } p-2 border border-gray-300 rounded w-full`}
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const filesArray = Array.from(e.target.files);
                    setFiles((prevFiles) => [...prevFiles, ...filesArray]);
                    setCapturedImages((prevImages) => [
                      ...prevImages,
                      ...filesArray.map((file) => URL.createObjectURL(file)),
                    ]);
                  }}
                />
              </div>

              {capturedImages.length > 0 &&
                capturedImages.map((url, index) => (
                  <div
                    key={index}
                    className="mt-4 flex w-full justify-between p-2 border items-center"
                  >
                    <img
                      src={url}
                      alt="listing preview"
                      className="w-20 h-20 object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 text-red-700 hover:opacity-75"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="flex w-6/12 m-auto justify-center rounded-md bg-myblue px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-center text-sm">{error}</p>}
        </form>
      </section>
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCaptureImage}
      />
      {verifiedWarning.warningDisplayed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg ">
            <p className="text-lg">
              Note that uploading image will cause your property to be
              unverified
            </p>
            <button
              onClick={() => {
                setVerifiedWarning({
                  verifiedWarning: false,
                  showUpload: true,
                });
                setFormData({
                  ...formData,
                  verified: false,
                });
              }}
              className="mt-4 p-2 bg-red-700 text-white rounded-md hover:bg-red-600 cursor-pointer "
            >
              I understand
            </button>
          </div>
        </div>
      )}
    </Helmet>
  );
}
