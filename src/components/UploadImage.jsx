import React from "react";

function UploadImage({ file, setFile, setError, setGeneratedImages, setJobCount }) {
      const [isDragging, setIsDragging] = React.useState(false);

      const handleFile = (selectedFile) => {
            if (!selectedFile) return;

            if (!selectedFile.type.startsWith("image/")) {
                  setError("Please upload a valid image file.");
                  return;
            }

            setFile(selectedFile);
      };

      const handleDragOver = (e) => {
            e.preventDefault();
            setIsDragging(true);
      };

      const handleDragLeave = () => {
            setIsDragging(false);
      };

      const handleDrop = (e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files[0]);
      };

      const handleChange = (e) => {
            handleFile(e.target.files[0]);
      };

      return (
            <div className="flex flex-col items-center mt-10 px-4">
                  <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("fileInput").click()}
                        className={`w-full max-w-md p-8 border-2 border-dashed rounded-lg cursor-pointer text-center transition
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
                  >
                        <input
                              id="fileInput"
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={handleChange}
                        />

                        {!file ? (
                              <div className="space-y-2">
                                    <p className="text-gray-700 font-medium">Drag & drop an image here</p>
                                    <p className="text-sm text-gray-400">or click to upload</p>
                              </div>
                        ) : (
                              <div className="space-y-3">
                                    <p className="text-sm text-gray-600">{file.name}</p>
                                    <img
                                          src={URL.createObjectURL(file)}
                                          alt="preview"
                                          className="w-full h-48 object-contain bg-gray-100 rounded-md"
                                    />
                                    <button
                                          onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                                setGeneratedImages([])
                                                setJobCount(null)
                                          }}
                                          className="text-sm text-red-500 hover:underline"
                                    >
                                          Remove image
                                    </button>
                              </div>
                        )}
                  </div>
            </div>
      );
}

export default UploadImage;
