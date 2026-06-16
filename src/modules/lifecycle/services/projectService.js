import { delay } from "../../../shared/utils/delay";
import { seedProjects, PROJECT_STATUSES } from "../../../shared/data/seedProjects";

const PROJECTS_KEY = "xini8_mock_projects_v2";

function readProjects() {
  const saved = localStorage.getItem(PROJECTS_KEY);
  if (!saved) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(seedProjects));
    return seedProjects;
  }
  return JSON.parse(saved);
}
function writeProjects(projects) { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)); }
function nextId(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`; }
function nextStatus(status) { const index = PROJECT_STATUSES.indexOf(status); return PROJECT_STATUSES[Math.min(index + 1, PROJECT_STATUSES.length - 1)] || status; }

export const projectService = {
  async listProjects({ user } = {}) {
    await delay(450);
    const projects = readProjects();
    if (!user) return [];
    if (user.role === "creator") return projects.filter((p) => p.creatorId === user.id || p.creatorId === "usr_creator_001");
    if (user.role === "admin") return projects;
    return projects.filter((p) => ["Approved", "Funding Open", "Funding Closed", "In Production", "Released"].includes(p.status));
  },
  async getProject(projectId) {
    await delay(350);
    return readProjects().find((project) => project.id === projectId) || null;
  },
  async createProject(user, payload) {
    await delay(850);
    const project = {
      id: nextId("prj"),
      creatorId: user.id,
      title: payload.title,
      genre: payload.genre,
      language: payload.language,
      runtime: Number(payload.runtime) || 0,
      synopsis: payload.synopsis,
      description: payload.description,
      targetAudience: payload.targetAudience,
      budget: Number(payload.budget) || 0,
      fundingGoal: Number(payload.fundingGoal) || 0,
      currentFunding: 0,
      lifecycleStage: payload.lifecycleStage || "Idea",
      status: "Draft",
      visibility: "private",
      studio: {
        brief: {
          logline: "",
          tone: "Premium cinematic",
          audience: payload.targetAudience || "",
          positioning: "Investor-ready film package",
          creativeHook: "",
        },
        synopsisDraft: payload.synopsis || "",
        projectDescription: payload.description || "",
        pitchSummary: "",
        documents: [],
        lastGeneratedAt: null,
      },
      team: [],
      milestones: [],
      updates: [{ id: nextId("up"), title: "Project draft created", body: "A new project draft has been created.", createdAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const projects = [project, ...readProjects()];
    writeProjects(projects);
    return { project, message: "Project created as draft." };
  },
  async updateProject(projectId, payload) {
    await delay(650);
    const projects = readProjects().map((project) => project.id === projectId ? { ...project, ...payload, updatedAt: new Date().toISOString() } : project);
    writeProjects(projects);
    return { project: projects.find((p) => p.id === projectId), message: "Project updated." };
  },
  async advanceStatus(projectId) {
    await delay(650);
    const projects = readProjects().map((project) => {
      if (project.id !== projectId) return project;
      const newStatus = nextStatus(project.status);
      return { ...project, status: newStatus, visibility: ["Approved", "Funding Open", "Funding Closed", "In Production", "Released"].includes(newStatus) ? "public" : project.visibility, updatedAt: new Date().toISOString(), updates: [{ id: nextId("up"), title: `Status changed to ${newStatus}`, body: "Workflow status updated in the lifecycle engine.", createdAt: new Date().toISOString() }, ...(project.updates || [])] };
    });
    writeProjects(projects);
    return { project: projects.find((p) => p.id === projectId), message: "Project workflow updated." };
  },
  async setStatus(projectId, status) {
    await delay(600);
    const projects = readProjects().map((project) => project.id === projectId ? { ...project, status, visibility: ["Approved", "Funding Open", "Funding Closed", "In Production", "Released"].includes(status) ? "public" : project.visibility, updatedAt: new Date().toISOString(), updates: [{ id: nextId("up"), title: `Admin set status: ${status}`, body: "Project status was updated by an administrator.", createdAt: new Date().toISOString() }, ...(project.updates || [])] } : project);
    writeProjects(projects);
    return { project: projects.find((p) => p.id === projectId), message: "Project status updated." };
  },
  async addTeamMember(projectId, payload) {
    await delay(500);
    const member = { id: nextId("tm"), ...payload };
    const projects = readProjects().map((project) => project.id === projectId ? { ...project, team: [member, ...(project.team || [])], updatedAt: new Date().toISOString() } : project);
    writeProjects(projects);
    return { member, project: projects.find((p) => p.id === projectId), message: "Team member added." };
  },
  async addMilestone(projectId, payload) {
    await delay(500);
    const milestone = { id: nextId("ms"), status: "pending", fundingReleasePercentage: Number(payload.fundingReleasePercentage) || 0, ...payload };
    const projects = readProjects().map((project) => project.id === projectId ? { ...project, milestones: [milestone, ...(project.milestones || [])], updatedAt: new Date().toISOString() } : project);
    writeProjects(projects);
    return { milestone, project: projects.find((p) => p.id === projectId), message: "Milestone added." };
  },
  async toggleMilestone(projectId, milestoneId) {
    await delay(450);
    const projects = readProjects().map((project) => project.id === projectId ? { ...project, milestones: (project.milestones || []).map((m) => m.id === milestoneId ? { ...m, status: m.status === "completed" ? "in_progress" : "completed" } : m), updatedAt: new Date().toISOString() } : project);
    writeProjects(projects);
    return { project: projects.find((p) => p.id === projectId), message: "Milestone updated." };
  },
  async addUpdate(projectId, payload) {
    await delay(500);
    const update = { id: nextId("up"), title: payload.title, body: payload.body, createdAt: new Date().toISOString() };
    const projects = readProjects().map((project) => project.id === projectId ? { ...project, updates: [update, ...(project.updates || [])], updatedAt: new Date().toISOString() } : project);
    writeProjects(projects);
    return { update, project: projects.find((p) => p.id === projectId), message: "Project update published." };
  },
};
