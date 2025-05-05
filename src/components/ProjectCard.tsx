import { Link } from 'react-router-dom';
import './ProjectCard.scss';

// Updated the id type to string if you're using MongoDB's ObjectId
interface ProjectCardProps {
  id: string;  // Use string if your backend returns the id as a string
  title: string;
  imageUrl: string;
}

const api = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, imageUrl }) => {
  return (
    <div className="project-card">
      <Link to={`/project/${id}`}>
        <img src={`${api}${imageUrl}`} alt={title} />
        <h3>{title}</h3>
      </Link>
    </div>
  );
};

export default ProjectCard;
