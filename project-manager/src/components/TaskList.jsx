import { tasks } from "../data/mockData";

export default function TaskList() {
  return (
    <div>
      <h3>Tasks</h3>
      {tasks.map(task => (
        <div key={task.id}>
          <p>{task.title} - {task.status}</p>
        </div>
      ))}
    </div>
  );
}