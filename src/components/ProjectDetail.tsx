import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './ProjectDetail.scss';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

// Getting the backend URL from environment variables
const api = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Fix the endpoint by adding /projects/ to the URL
    axios.get<Project>(`${api}/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(() => setProject(null));
  }, [id]);

  if (!project) return <div className="project-detail">Loading or not found...</div>;

  return (
    <div className="project-detail">
      <h2>{project.title}</h2>
      <img src={`${api}${project.imageUrl}`} alt={project.title} />
      <p>{project.description}</p>
    </div>
  );
}
