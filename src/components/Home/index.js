import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectCard from '../ProjectCard'
import Header from '../Header'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    activeCategoryId: categoriesList[0].id,
    projectsList: [],
  }

  componentDidMount() {
    this.getAllProjects()
  }

  getAllProjects = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeCategoryId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.projects.map(project => ({
        id: project.id,
        imageUrl: project.image_url,
        name: project.name,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#007BFF" height="80" width="80" />
    </div>
  )

  onClickRetry = () => {
    this.getAllProjects()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-info">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  onChangeCategory = event => {
    this.setState({activeCategoryId: event.target.value}, () =>
      this.getAllProjects(),
    )
  }

  renderProjectsListView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-container">
        {projectsList.map(project => (
          <ProjectCard projectData={project} key={project.id} />
        ))}
      </ul>
    )
  }

  renderProjectsData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsListView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state
    return (
      <>
        <Header />
        <div className="bg-container">
          <select
            value={activeCategoryId}
            onChange={this.onChangeCategory}
            className="select-container"
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectsData()}
        </div>
      </>
    )
  }
}

export default Home
