import { useState } from 'react';
import axios from 'axios';
import './AddProject.scss';

const api = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export default function AddProject() {
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState<string | null>(null); // For error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (image) formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);

    setLoading(true);
    setError(null); // Reset error message

    try {
      await axios.post(`${api}/projects`, formData);
      alert("Project added!");
      setTitle(''); // Clear title
      setDesc(''); // Clear description
      setImage(null); // Clear image
    } catch (err) {
      setError('Failed to add project. Please try again.');
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-project">
      {error && <div className="error">{error}</div>} {/* Display error message */}
      
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      
      <textarea
        value={description}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description"
        required
      />
      
      <input
        type="file"
        onChange={e => setImage(e.target.files?.[0] || null)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Project'}
      </button>
    </form>
  );
}
