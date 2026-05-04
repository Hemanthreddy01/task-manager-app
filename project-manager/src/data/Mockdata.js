export const user = {
  id: "1",
  name: "Hemanth",
  role: "admin",
};

export const projects = [
  { id: "p1", name: "Website", description: "Build UI" },
];

export const tasks = [
  {
    id: "t1",
    title: "Design Login Page",
    projectId: "p1",
    assignedTo: "1",
    status: "todo",
  },
  {
    id: "t2",
    title: "Setup Dashboard",
    projectId: "p1",
    assignedTo: "1",
    status: "done",
  },
];