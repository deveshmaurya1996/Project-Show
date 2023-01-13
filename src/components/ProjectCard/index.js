import './index.css'

const ProjectCard = props => {
  const {projectData} = props
  const {name, imageUrl} = projectData

  return (
    <li className="project-container">
      <img className="project-image" src={imageUrl} alt={name} />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectCard
