import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import DomainService from "@/src/appwrite/domainServices";

const domainService = new DomainService();

const EditDomain = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [imageId, setImageId] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function fetchDomain() {
      const domain = await domainService.getDomainById(id);
      setTitle(domain.title);
      setDescription(domain.description);
      setLevel(domain.level);
      setImageId(domain.imageId);
    }
    fetchDomain();
  }, [id]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageId = imageId;

    
      if (newImage) {
        const uploaded = await domainService.uploadDomainImage(newImage);
        finalImageId = uploaded.$id;
      }

      await domainService.updateDomain(id, {
        title,
        description,
        level,
        imageId: finalImageId,
      });

      alert("Domain updated successfully");
      navigate("/dashboard/alldomains");
    } catch (err) {
      console.error(err);
      alert("Failed to update domain");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Domain</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image */}
        {(preview || imageId) && (
          <img
            src={
              preview ||
              domainService.getImagePreview(imageId)
            }
            alt="Domain"
            className="w-full h-40 object-cover rounded"
          />
        )}

        <input type="file" onChange={handleImageChange} />

        {/* Title */}
        <input
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Level */}
        <select
          className="border p-2 w-full"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          disabled={loading}
          className="bg-black text-white py-2 px-4 rounded w-full"
        >
          {loading ? "Updating..." : "Update Domain"}
        </button>
      </form>
    </div>
  );
};

export default EditDomain;
