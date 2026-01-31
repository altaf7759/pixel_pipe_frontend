import { useState, useRef, useEffect } from "react";
import UploadImage from "../components/UploadImage.jsx";
import GeneratedImagesGrid from "../components/GeneratedImageGrid.jsx";

function GenerateImagesPage() {
      const [file, setFile] = useState(null);
      const [generatedImages, setGeneratedImages] = useState([]);
      const [parentJobId, setParentJobId] = useState("");
      const [jobCount, setJobCount] = useState(null)
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");

      const backend_url = import.meta.env.VITE_BACKEND_URL;
      const eventSourceRef = useRef(null);

      const allJobsCompleted = jobCount !== null && generatedImages.length === jobCount;

      const isButtonDisabled = !file || loading || allJobsCompleted;

      const progress = jobCount && jobCount > 0
            ? Math.round((generatedImages.length / jobCount) * 100)
            : 0;


      const handleGenerate = async () => {
            if (!file) {
                  setError("Please upload an image first.");
                  return;
            }

            setLoading(true);
            setError("");
            setGeneratedImages([]);
            setJobCount(null);

            try {
                  const formData = new FormData();
                  formData.append("image", file);

                  const res = await fetch(`${backend_url}/api/image/upload`, {
                        method: "POST",
                        body: formData,
                  });

                  if (!res.ok) {
                        throw new Error("Upload failed");
                  }

                  const data = await res.json();

                  if (!data.parentJobId || typeof data.jobCount !== "number") {
                        throw new Error("Invalid server response");
                  }

                  setJobCount(data.jobCount);
                  listenToSSE(data.parentJobId, data.jobCount);
            } catch (err) {
                  setError(err.message || "Something went wrong.");
                  setLoading(false);
            }
      };


      const listenToSSE = (parentJobId, expectedCount) => {
            setParentJobId(parentJobId);

            if (eventSourceRef.current) {
                  eventSourceRef.current.close();
            }

            const eventSource = new EventSource(
                  `${backend_url}/api/updates/${parentJobId}`
            );

            eventSourceRef.current = eventSource;

            eventSource.onmessage = (event) => {
                  const payload = JSON.parse(event.data);

                  if (payload.parentJobId !== parentJobId) return;

                  if (payload.status === "completed" && payload.image) {
                        setGeneratedImages((prev) => {
                              const next = [
                                    ...prev,
                                    {
                                          jobId: payload.jobId,
                                          parentJobId: payload.parentJobId,
                                          status: payload.status,
                                          type: payload.type,
                                          image: payload.image,
                                    },
                              ];

                              // ✅ all jobs done
                              if (next.length === expectedCount) {
                                    setLoading(false);
                                    eventSource.close();
                              }

                              return next;
                        });
                  }
            };

            eventSource.onerror = () => {
                  setError("Connection lost while generating images.");
                  setLoading(false);
                  eventSource.close();
            };
      };



      // Cleanup on unmount
      useEffect(() => {
            return () => {
                  if (eventSourceRef.current) {
                        eventSourceRef.current.close();
                  }
            };
      }, []);

      return (
            <div className="max-w-3xl mx-auto px-4 pb-10">
                  <UploadImage file={file} setFile={setFile} setGeneratedImages={setGeneratedImages} setJobCount={setJobCount} setError={setError} />

                  <div className="flex justify-center mt-6">
                        <button
                              onClick={handleGenerate}
                              disabled={isButtonDisabled}
                              className={`relative px-8 py-2 rounded-md font-medium transition overflow-hidden
                                    ${!isButtonDisabled
                                          ? "bg-blue-600 text-white hover:bg-blue-700"
                                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                        >
                              {/* Progress bar */}
                              {loading && (
                                    <span
                                          className="absolute left-0 top-0 h-full bg-blue-800 transition-all duration-300"
                                          style={{ width: `${progress}%` }}
                                    />
                              )}

                              {/* Button text */}
                              <span className="relative z-10">
                                    {loading
                                          ? `Generating ${progress}%`
                                          : allJobsCompleted
                                                ? "Completed"
                                                : "Generate Variations"}
                              </span>
                        </button>
                  </div>


                  {error && (
                        <p className="mt-3 text-sm text-red-500 text-center">
                              {error}
                        </p>
                  )}

                  {allJobsCompleted && (
                        <p className="mt-2 text-sm text-green-600 text-center">
                              All images generated 🎉 Remove image to generate again.
                        </p>
                  )}


                  <GeneratedImagesGrid images={generatedImages} />
            </div>
      );
}

export default GenerateImagesPage;
