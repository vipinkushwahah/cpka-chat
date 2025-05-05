import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

interface Project {
  id: string;  // Ensure that the ID is a string (if it's a MongoDB ObjectId)
  title: string;
  imageUrl: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Specify the expected data type here
    axios.get<Project[]>('https://chat-backend-gtvs.onrender.com/projects')
      .then(res => setProjects(res.data));
  }, []);

  return (
    <div className="home">
      <Link to="/add">Add New Project</Link>
      <div className="project-list">
        {projects.map(p => (
          <Link key={p.id} to={`/project/${p.id}`}>
            <div className="project-card">
              <img src={`https://chat-backend-gtvs.onrender.com${p.imageUrl}`} alt={p.title} />
              <h3>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
