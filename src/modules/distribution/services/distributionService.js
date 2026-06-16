import { delay } from "../../../shared/utils/delay";
import { seedDistributionProjects, seedPartners } from "../../../shared/data/seedDistribution";

const DIST_PROJECTS_KEY = "xini8_mock_distribution_projects_v1";
const DIST_PARTNERS_KEY = "xini8_mock_distribution_partners_v1";

function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function readJson(key, fallback) {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return safeParse(saved, fallback);
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;
}

function listProjectsRaw() {
  return readJson(DIST_PROJECTS_KEY, seedDistributionProjects);
}

function listPartnersRaw() {
  return readJson(DIST_PARTNERS_KEY, seedPartners);
}

function calcMaterialProgress(materials = {}) {
  const values = Object.values(materials);
  if (!values.length) return 0;
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

function enrichProject(project) {
  return {
    ...project,
    materialProgress: calcMaterialProgress(project.materials),
    openRequests: (project.requests || []).filter((request) => request.status !== "Closed").length,
    interestCount: (project.partnerInterest || []).length,
  };
}

export const distributionService = {
  async getOverview() {
    await delay(420);
    const projects = listProjectsRaw().map(enrichProject);
    const partners = listPartnersRaw();
    const requests = projects.flatMap((project) =>
      (project.requests || []).map((request) => ({ ...request, projectId: project.id, projectTitle: project.title }))
    );
    const interests = projects.flatMap((project) =>
      (project.partnerInterest || []).map((interest) => ({ ...interest, projectId: project.id, projectTitle: project.title }))
    );
    return { projects, partners, requests, interests };
  },

  async listPartners({ type = "all", query = "" } = {}) {
    await delay(320);
    const normalized = query.trim().toLowerCase();
    return listPartnersRaw().filter((partner) => {
      const matchesType = type === "all" || partner.type === type;
      const matchesQuery = !normalized || `${partner.name} ${partner.region} ${partner.focus} ${partner.type}`.toLowerCase().includes(normalized);
      return matchesType && matchesQuery;
    });
  },

  async listProjects({ status = "all", query = "" } = {}) {
    await delay(360);
    const normalized = query.trim().toLowerCase();
    return listProjectsRaw().map(enrichProject).filter((project) => {
      const matchesStatus = status === "all" || project.distributionStatus === status;
      const matchesQuery = !normalized || `${project.title} ${project.genre} ${project.creatorName} ${project.targetMarkets.join(" ")}`.toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  },

  async getProject(distributionId) {
    await delay(260);
    const project = listProjectsRaw().find((item) => item.id === distributionId || item.projectId === distributionId);
    return project ? enrichProject(project) : null;
  },

  async addPartnerInterest(distributionId, payload) {
    await delay(620);
    const projects = listProjectsRaw().map((project) => {
      if (project.id !== distributionId) return project;
      const interest = {
        id: uid("int"),
        partnerId: payload.partnerId || "custom",
        partnerName: payload.partnerName,
        stage: payload.stage || "Partner Interested",
        note: payload.note || "Partner interest added from marketplace.",
        updatedAt: new Date().toISOString(),
      };
      return {
        ...project,
        distributionStatus: interest.stage,
        partnerInterest: [interest, ...(project.partnerInterest || [])],
      };
    });
    writeJson(DIST_PROJECTS_KEY, projects);
    return { project: enrichProject(projects.find((item) => item.id === distributionId)), message: "Partner interest recorded." };
  },

  async createRequest(distributionId, payload) {
    await delay(620);
    const projects = listProjectsRaw().map((project) => {
      if (project.id !== distributionId) return project;
      const request = {
        id: uid("req"),
        partnerName: payload.partnerName,
        requestType: payload.requestType,
        status: "Open",
        priority: payload.priority || "Medium",
        createdAt: new Date().toISOString(),
      };
      return { ...project, requests: [request, ...(project.requests || [])] };
    });
    writeJson(DIST_PROJECTS_KEY, projects);
    return { project: enrichProject(projects.find((item) => item.id === distributionId)), message: "Distribution request created." };
  },

  async updateRequestStatus(distributionId, requestId, status) {
    await delay(420);
    const projects = listProjectsRaw().map((project) => {
      if (project.id !== distributionId) return project;
      return {
        ...project,
        requests: (project.requests || []).map((request) => request.id === requestId ? { ...request, status } : request),
      };
    });
    writeJson(DIST_PROJECTS_KEY, projects);
    return { project: enrichProject(projects.find((item) => item.id === distributionId)), message: "Request status updated." };
  },
};
