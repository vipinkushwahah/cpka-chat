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

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Explicitly define the response type here
    axios.get<Project>(`https://chat-backend-gtvs.onrender.com/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(() => setProject(null));
  }, [id]);

  if (!project) return <div className="project-detail">Loading or not found...</div>;

  return (
    <div className="project-detail">
      <h2>{project.title}</h2>
      <img src={`https://chat-backend-gtvs.onrender.com${project.imageUrl}`} alt={project.title} />
      <p>{project.description}</p>
    </div>
  );
}
