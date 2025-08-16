import React from "react";

export default function TaskItem({ task, onEdit, onDelete}) {
  const tagColor =
    task.status === "Done"
      ? "bg-green-600"
      : task.status === "On Progress"
      ? "bg-yellow-500"
      : "bg-gray-600";

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-lg font-semibold truncate">{task.title}</h4>
          <p className="text-sm text-gray-300 mt-1 line-clamp-3">
            {task.description || "-"}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-3">
            <span
              className={`${tagColor} text-white px-2 py-0.5 rounded-full text-xs font-semibold leading-none`}
            >
              {task.status}
            </span>
            <span>Deadline: {task.deadline || "-"}</span>
            <span>
              Created:{" "}
              {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
            </span>
          </div>

          <div className="text-sm text-gray-400 mt-2">
            Members:{" "}
            {task.members && task.members.length
              ? task.members.join(", ")
              : "-"}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {onEdit && onDelete && (
            <>
              <button
                onClick={() => onEdit(task)}
                title="Edit Task"
                className="p-1 rounded hover:bg-white/5"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task.id)}
                title="Delete Task"
                className="p-1 rounded hover:bg-red-600/20 text-red-400"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
