import { useState } from "react";
import DomainService from "@/src/appwrite/domainServices";
import { Button } from "@/components/ui/button";

const domainService = new DomainService();

const AddDomainForm = ({ onSuccess, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) {
      setError("Domain image is required");
      return;
    }

    setLoading(true);

    try {
      
      const uploadedImage = await domainService.uploadDomainImage(image);

      await domainService.createDomain({
        title,
        description,
        level,
        imageId: uploadedImage.$id,
        isActive: true,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to add domain");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Domain Image</label>

        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-md border"
          />
        ) : (
          <div className="w-full h-40 border border-dashed rounded-md flex items-center justify-center text-gray-400 text-sm">
            No image selected
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm"
        />
      </div>
      <input
        className="w-full border rounded p-2"
        placeholder="Domain title (e.g. MERN Stack)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Domain description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select
        className="w-full border rounded p-2"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Domain"}
      </Button>
    </form>
  );
};

export default AddDomainForm;
