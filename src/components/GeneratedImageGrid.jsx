function GeneratedImagesGrid({ images }) {
      if (!images.length) return null;

      const handleDownload = (image, type, jobId) => {
            const link = document.createElement("a");
            link.href = image;
            link.download = `${type}-${jobId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
      };

      return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {images.map((img) => (
                        <div
                              key={img.jobId}
                              className="rounded-md overflow-hidden bg-gray-50 border border-gray-200 text-center p-2 md:p-5"
                        >
                              <p className="text-gray-500 mb-2">{img.type}</p>

                              <img
                                    src={img.image}
                                    alt="generated"
                                    className="w-full h-auto rounded-md"
                              />

                              <button
                                    onClick={() =>
                                          handleDownload(img.image, img.type, img.jobId)
                                    }
                                    className="mt-2 text-sm text-gray-500 hover:underline"
                              >
                                    Download
                              </button>
                        </div>
                  ))}
            </div>
      );
}

export default GeneratedImagesGrid;
