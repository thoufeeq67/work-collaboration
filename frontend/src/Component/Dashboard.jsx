import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const DashboardPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // UseEffect to set userEmail when component mounts or location.state changes
  const getEmail = async () => {
    try {
      const response = await axios.get("http://localhost:5000/login/success", {
        withCredentials: true,
      });
      const data = await response.data;
      console.log(data);
      console.log(data.data);
      setUserEmail(data.data);
      setIsVisible(true);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("user")) &&
      JSON.parse(localStorage.getItem("user"))?.email
    ) {
      setUserEmail(JSON.parse(localStorage.getItem("user")).email);
      setIsVisible(true);
    } else {
      getEmail();
    }

    if (!JSON.parse(localStorage.getItem("user"))) {
      navigate("/login");
    }
  }, []);

  // UseEffect to set userEmail when component mounts or location.state changes
  useEffect(() => {
    const { email } = location.state || {};
    if (email) {
      setUserEmail(email);
    }
  }, [location.state]);

  // UseEffect to fetch projects when userEmail changes
  useEffect(() => {
    if (!userEmail) return; // Do nothing if userEmail is not set

    const fetchProjects = async () => {
      try {
        console.log("Fetching projects for:", userEmail);
        const response = await fetch("http://localhost:5000/api/projects/all", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const user = JSON.parse(localStorage.getItem("user"));
        const projectId = localStorage.getItem("currentProjectId");
        setProjects(data);
        if (data.length <= 0) {
          localStorage.removeItem(`prac-kanban-${user._id}-${projectId}`);
        }
        setFilteredProjects(data); // Initialize filteredProjects with all projects
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, [userEmail]);

  const handleProfileClick = () => {
    navigate("/user-profile", { state: { email: userEmail } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter projects based on the search term
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          tasks: [], // Initialize with empty tasks
          email: userEmail, // Pass the user's email
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update the projects list
        setProjects((prev) => [...prev, data]);
        setFilteredProjects((prev) => [...prev, data]); // Update filteredProjects with new project

        // Clear the new project form
        setNewProject({ title: "", description: "" });

        // Retrieve user data from localStorage
        const user = JSON.parse(localStorage.getItem("user"));

        // Retrieve or initialize the user's projects in localStorage
        let userProjects =
          JSON.parse(localStorage.getItem(`projects-${user._id}`)) || [];

        // Add the newly created project to the user's projects list
        userProjects.push(data);

        // Store the updated projects list in localStorage
        localStorage.setItem(
          `projects-${user._id}`,
          JSON.stringify(userProjects)
        );

        // Set the new project ID as the current project
        localStorage.setItem("currentProjectId", data._id);

        // Initialize an empty kanban board for the new project
        localStorage.setItem(
          `prac-kanban-${user._id}-${data._id}`,
          JSON.stringify([])
        );
      } else {
        const errorText = await response.text();
        console.error("Failed to create project:", errorText);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const deleteProjectById = async (id) => {
    const userResponse = window.confirm("Do you really wanna delete?");
    if (userResponse)
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          alert("Deleted successfully!");
          window.location.reload();
        } else {
          const errorText = await response.text();
          console.error("Failed to delete project:", errorText);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-400 p-4 shadow">
        <nav className="flex justify-between items-center">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="text-lg text-white font-bold flex items-center"
          >
            <BiArrowBack /> <span className="pl-2">Go Back</span>
          </button>
          <div className="flex items-center">
            {isVisible && (
              <button
                onClick={handleProfileClick}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
              >
                Profile
              </button>
            )}
            {isVisible && (
              <button
                onClick={() => {
                  localStorage.removeItem("loggedIn");
                  localStorage.removeItem("user");
                  navigate("/");
                }}
                className="bg-gray-200 ml-5 hover:bg-red-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </header>
      <main className="p-4 flex">
        <section className="w-3/5">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {userEmail}!</p>
        </section>
        <section className="">
          <h2 className="text-lg font-bold text-gray-800">
            Create New Project
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 shadow rounded-lg mt-2"
          >
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={newProject.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Project Description"
              value={newProject.description}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded"
              rows={5}
              required
            />

            <button
              type="submit"
              className="w-full p-2 mt-4 bg-indigo-600 text-white rounded"
            >
              Create Project
            </button>
          </form>
        </section>
      </main>
      <section className="mt-4 p-4">
        <h2 className="text-lg font-bold text-gray-800">Your Projects</h2>
        <input
          type="text"
          placeholder="Search projects"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 mt-2 border border-gray-300 rounded"
        />
        <ul className="mt-2">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <li
                key={project._id}
                className="flex justify-between items-center bg-white shadow p-4 rounded-lg mt-2"
              >
                <p>{project.title}</p>
                <div>
                  <button
                    onClick={() => deleteProjectById(project._id)}
                    className="bg-red-400 mr-7 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/project/${project.title}`);
                      localStorage.setItem("currentProjectId", project._id);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  >
                    Go to Project
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No projects found.</p>
          )}
        </ul>
      </section>
    </div>
  );
};

export default DashboardPage;
