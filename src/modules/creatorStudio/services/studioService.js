import { delay } from "../../../shared/utils/delay";

const PROJECTS_KEY = "xini8_mock_projects_v2";

function readProjects() {
  const saved = localStorage.getItem(PROJECTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function writeProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;
}

function getStudioDefaults(project = {}) {
  return {
    brief: {
      logline: project.logline || "",
      tone: project.tone || "Premium cinematic",
      audience: project.targetAudience || "",
      positioning: project.positioning || "Investor-ready independent film package",
      creativeHook: project.creativeHook || "",
      ...project.studio?.brief,
    },
    synopsisDraft: project.studio?.synopsisDraft || project.synopsis || "",
    projectDescription: project.studio?.projectDescription || project.description || "",
    pitchSummary: project.studio?.pitchSummary || "",
    documents: project.studio?.documents || project.documents || [],
    lastGeneratedAt: project.studio?.lastGeneratedAt || null,
  };
}

function withStudio(project, studio) {
  return {
    ...project,
    synopsis: studio.synopsisDraft || project.synopsis,
    description: studio.projectDescription || project.description,
    targetAudience: studio.brief?.audience || project.targetAudience,
    studio,
    updatedAt: new Date().toISOString(),
  };
}

function readableFileSize(size = 0) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export const studioService = {
  async getProjectPackage(projectId) {
    await delay(360);
    const project = readProjects().find((item) => item.id === projectId);
    if (!project) return null;
    return { project, studio: getStudioDefaults(project) };
  },

  async saveBrief(projectId, payload) {
    await delay(650);
    let savedProject = null;

    const projects = readProjects().map((project) => {
      if (project.id !== projectId) return project;

      const studio = getStudioDefaults(project);
      const nextStudio = {
        ...studio,
        brief: {
          ...studio.brief,
          ...payload,
        },
      };

      savedProject = withStudio(project, nextStudio);
      return savedProject;
    });

    writeProjects(projects);

    return {
      project: savedProject,
      studio: getStudioDefaults(savedProject),
      message: "Project brief saved.",
    };
  },

  async saveSynopsis(projectId, synopsisDraft) {
    await delay(600);
    let savedProject = null;

    const projects = readProjects().map((project) => {
      if (project.id !== projectId) return project;

      const studio = getStudioDefaults(project);
      const nextStudio = {
        ...studio,
        synopsisDraft,
      };

      savedProject = withStudio(project, nextStudio);
      return savedProject;
    });

    writeProjects(projects);

    return {
      project: savedProject,
      studio: getStudioDefaults(savedProject),
      message: "Synopsis saved.",
    };
  },

  async saveDescription(projectId, projectDescription) {
    await delay(600);
    let savedProject = null;

    const projects = readProjects().map((project) => {
      if (project.id !== projectId) return project;

      const studio = getStudioDefaults(project);
      const nextStudio = {
        ...studio,
        projectDescription,
      };

      savedProject = withStudio(project, nextStudio);
      return savedProject;
    });

    writeProjects(projects);

    return {
      project: savedProject,
      studio: getStudioDefaults(savedProject),
      message: "Project description saved.",
    };
  },

  async generateProjectDescription(projectId) {
    await delay(1050);
    let savedProject = null;

    const projects = readProjects().map((project) => {
      if (project.id !== projectId) return project;

      const studio = getStudioDefaults(project);
      const brief = studio.brief;
      const generated = `${project.title} is a ${project.genre?.toLowerCase() || "film"} project positioned for a ${brief.audience || project.targetAudience || "global audience"}. The project combines ${brief.tone?.toLowerCase() || "cinematic storytelling"} with a clear lifecycle path across development, funding, production, and distribution. ${studio.synopsisDraft || project.synopsis || "The story is designed to create strong audience engagement and investor-facing clarity."} The package is structured to help stakeholders understand the creative direction, funding need, production readiness, and long-term revenue opportunity.`;

      const nextStudio = {
        ...studio,
        projectDescription: generated,
        lastGeneratedAt: new Date().toISOString(),
      };

      savedProject = withStudio(project, nextStudio);
      return savedProject;
    });

    writeProjects(projects);

    return {
      project: savedProject,
      studio: getStudioDefaults(savedProject),
      message: "AI project description generated.",
    };
  },

  async generatePitchSummary(projectId) {
    await delay(1050);
    let savedProject = null;

    const projects = readProjects().map((project) => {
      if (project.id !== projectId) return project;

      const studio = getStudioDefaults(project);
      const brief = studio.brief;
      const generated = `${project.title} offers investors a focused ${project.genre?.toLowerCase() || "film"} opportunity with a defined funding goal of $${Number(project.fundingGoal || 0).toLocaleString()}. The project is currently in ${project.lifecycleStage || "development"} with a ${project.status} workflow status. Its core appeal is ${brief.creativeHook || brief.positioning || "a strong cinematic concept with marketplace potential"}. XINI8 can position this package for funding readiness, audience growth, distribution interest, and revenue participation tracking.`;

      const nextStudio = {
        ...studio,
        pitchSummary: generated,
        lastGeneratedAt: new Date().toISOString(),
      };

      savedProject = withStudio(project, nextStudio);
      return savedProject;
    });

    writeProjects(projects);

    return {
      project: savedProject,
      studio: getStudioDefaults(savedProject),
      message: "AI pitch summary generated.",
    };
  },

  async uploadDocument(projectId, documentType, file) {
    await delay(850);
    let savedProject = null;

    const document = {
      id: uid("doc"),
      documentType,
      fileName: file?.name || `${documentType}.pdf`,
      fileSize: readableFileSize(file?.size || 0),
      mimeType: file?.type || "application/octet-stream",
      status: "Uploaded",
      uploadedAt: new Date().toISOString(),
      visibility: documentType === "investor_documents" ? "Investor only" : "Project team",
    };

    const projects = readProjects().map((project) => {
      if (project.id !== projectId) return project;

      const studio = getStudioDefaults(project);
      const docs = [document, ...(studio.documents || []).filter((item) => item.documentType !== documentType)];
      const nextStudio = {
        ...studio,
        documents: docs,
      };

      savedProject = withStudio(project, nextStudio);
      return savedProject;
    });

    writeProjects(projects);

    return {
      project: savedProject,
      studio: getStudioDefaults(savedProject),
      document,
      message: "Document uploaded to project package.",
    };
  },

  async removeDocument(projectId, documentId) {
    await delay(450);
    let savedProject = null;

    const projects = readProjects().map((project) => {
      if (project.id !== projectId) return project;

      const studio = getStudioDefaults(project);
      const nextStudio = {
        ...studio,
        documents: (studio.documents || []).filter((item) => item.id !== documentId),
      };

      savedProject = withStudio(project, nextStudio);
      return savedProject;
    });

    writeProjects(projects);

    return {
      project: savedProject,
      studio: getStudioDefaults(savedProject),
      message: "Document removed.",
    };
  },
};
