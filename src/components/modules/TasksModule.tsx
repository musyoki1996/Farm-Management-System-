import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { FarmTask } from '../../types/index.ts';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  MapPin,
  X,
  Trash2,
  CheckCircle,
  ArrowRight,
  Kanban,
  List,
} from 'lucide-react';

export const TasksModule: React.FC = () => {
  const { activeFarm, tasks, addTask, updateTaskStatus, deleteTask, formatMoney } = useApp();
  const farmTasks = tasks.filter((t) => t.farmId === activeFarm.id);

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // New Task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<FarmTask['priority']>('High');
  const [assignedTo, setAssignedTo] = useState('Peter Waweru (Senior Agronomist)');
  const [blockLocation, setBlockLocation] = useState(activeFarm.blocks[0]?.name || 'Block A-1');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedHours, setEstimatedHours] = useState<number>(4);
  const [costKes, setCostKes] = useState<number>(15000);

  const statusLanes: FarmTask['status'][] = ['Pending', 'In Progress', 'Under Review', 'Completed'];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addTask({
      farmId: activeFarm.id,
      title,
      description,
      priority,
      status: 'Pending',
      assignedTo,
      blockLocation,
      dueDate,
      estimatedHours: Number(estimatedHours),
      costKes: Number(costKes),
    });

    setIsAddTaskOpen(false);
    setTitle('');
    setDescription('');
  };

  const getPriorityStyle = (p: FarmTask['priority']) => {
    switch (p) {
      case 'Urgent':
        return 'bg-red-100 text-red-900 border-red-200';
      case 'High':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Medium':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Farm Operations & Field Task Kanban</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Operational work orders, worker assignments, due dates, and completion status for {activeFarm.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md ${viewMode === 'kanban' ? 'bg-white shadow-xs text-emerald-900 font-bold' : 'text-neutral-500'}`}
              title="Kanban Board"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-xs text-emerald-900 font-bold' : 'text-neutral-500'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Field Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {statusLanes.map((lane) => {
            const laneTasks = farmTasks.filter((t) => t.status === lane);
            return (
              <div key={lane} className="bg-neutral-100/70 p-3.5 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-xs text-neutral-800 uppercase tracking-wider">{lane}</h3>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-neutral-700 shadow-2xs">
                    {laneTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[160px]">
                  {laneTasks.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-neutral-400 italic">No tasks in this lane.</div>
                  ) : (
                    laneTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs hover:border-neutral-300 transition-all space-y-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-neutral-400 hover:text-red-700 p-1"
                            title="Delete task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <h4 className="font-bold text-neutral-900 leading-tight">{task.title}</h4>
                        <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">{task.description}</p>

                        <div className="pt-2 border-t border-neutral-100 space-y-1 text-[11px] text-neutral-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            <span className="truncate">{task.blockLocation}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3 text-neutral-400" />
                              <span className="truncate max-w-[110px]">{task.assignedTo.split(' ')[0]}</span>
                            </div>
                            <span className="font-mono text-neutral-700 font-semibold">{task.dueDate}</span>
                          </div>
                        </div>

                        {/* Status Mover Buttons */}
                        <div className="pt-2 flex items-center justify-between gap-1 border-t border-neutral-100">
                          {lane !== 'Completed' && (
                            <button
                              onClick={() => {
                                const nextIndex = statusLanes.indexOf(lane) + 1;
                                if (nextIndex < statusLanes.length) {
                                  updateTaskStatus(task.id, statusLanes[nextIndex]);
                                }
                              }}
                              className="w-full py-1.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors text-center"
                            >
                              Advance Status →
                            </button>
                          )}
                          {lane === 'Completed' && (
                            <div className="w-full text-center text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Task Title & Details</th>
                <th className="py-3 px-4">Block Location</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {farmTasks.map((task) => (
                <tr key={task.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-neutral-900">{task.title}</div>
                    <div className="text-[11px] text-neutral-500">{task.description}</div>
                  </td>
                  <td className="py-3 px-4 text-neutral-700 font-medium">{task.blockLocation}</td>
                  <td className="py-3 px-4 text-neutral-800">{task.assignedTo}</td>
                  <td className="py-3 px-4 font-mono text-neutral-600">{task.dueDate}</td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                      className="text-[11px] font-semibold bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200 cursor-pointer focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Assign Task */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Assign Operational Task</h3>
              <button onClick={() => setIsAddTaskOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Task Title *</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weed Block A-1 with Casual Team"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specific requirements, chemicals to mix, safety gear..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Urgent">Urgent (Immediate Action)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Due Deadline</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Field Block Location</label>
                  <select
                    value={blockLocation}
                    onChange={(e) => setBlockLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    {activeFarm.blocks.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Assigned Worker</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
