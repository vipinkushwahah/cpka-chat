import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

interface Project {
  id: string;  // Ensure that the ID is a string (if it's a MongoDB ObjectId)
  title: string;
  imageUrl: string;
}

const api = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Project[]>(`${api}/projects`)
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch projects.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home">
      <Link to="/add">Add New Project</Link>
      <div className="project-list">
        {projects.map(p => (
          <Link key={p.id} to={`/project/${p.id}`}>
            <div className="project-card">
              <img 
                src={`${api}${p.imageUrl}`} 
                alt={p.title} 
                onError={(e) => (e.target as HTMLImageElement).src = '/default-image.jpg'} // Fallback image
              />
              <h3>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
