import DomainService from "@/src/appwrite/domainServices";
import { useState } from "react";

const domainService = new DomainService();

const AddDomain = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImage = await domainService.uploadDomainImage(image);

      const domainData = {
        title,
        description,
        level,
        imageId: uploadedImage.$id,
        isActive: true,
      };

      await domainService.createDomain(domainData);

      alert("Domain added successfully!");

      setTitle("");
      setDescription("");
      setLevel("beginner");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add domain");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Domain</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Domain Image</label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded mb-2"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Domain Title</label>
          <input
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="MERN Stack"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded p-2 h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Learn how to build full stack apps"
            required
          />
        </div>

        
        <div>
          <label className="block font-medium mb-1">Level</label>
          <select
            className="w-full border rounded p-2"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

          
        <button
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Adding..." : "Add Domain"}
        </button>
      </form>
    </div>
  );
};

export default AddDomain;
