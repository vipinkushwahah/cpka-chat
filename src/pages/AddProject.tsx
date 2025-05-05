import { useState } from 'react';
import axios from 'axios';
import './AddProject.scss';

export default function AddProject() {
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (image) formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);

    await axios.post('https://chat-backend-gtvs.onrender.com/projects', formData);
    alert("Project added!");
  };

  return (
    <form onSubmit={handleSubmit} className="add-project">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={e => setDesc(e.target.value)} placeholder="Description" />
      <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} />
      <button type="submit">Add</button>
    </form>
  );
}
