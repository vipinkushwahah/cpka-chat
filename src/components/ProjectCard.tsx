// src/components/ProjectCard.tsx

import { Link } from 'react-router-dom';
import './ProjectCard.scss';

interface ProjectCardProps {
  id: number;
  title: string;
  imageUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, imageUrl }) => {
  return (
    <div className="project-card">
      <Link to={`/project/${id}`}>
        <img src={`https://chat-backend-gtvs.onrender.com${imageUrl}`} alt={title} />
        <h3>{title}</h3>
      </Link>
    </div>
  );
};

export default ProjectCard;
