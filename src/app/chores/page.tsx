"use client";

import { FC, useState } from "react";
import { useChores } from "@/context/chores/ChoresContext";
import OnScreenKeyboard from "@/components/shared/OnScreenKeyboard";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type AdminTab = "chores" | "people" | "assignments";
type FocusedInput = "choreName" | "assigneeName" | null;

const ChoresPage: FC = () => {
  const { chores, assignees, assignments, loading, toggleAssignmentComplete, resetAllAssignments, refetchData } = useChores();
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>("chores");
  const [showCreateChore, setShowCreateChore] = useState(false);
  const [showCreateAssignee, setShowCreateAssignee] = useState(false);
  const [showAssignChore, setShowAssignChore] = useState(false);
  const [newChoreName, setNewChoreName] = useState("");
  const [newAssigneeName, setNewAssigneeName] = useState("");
  const [selectedChoreId, setSelectedChoreId] = useState<number | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [focusedInput, setFocusedInput] = useState<FocusedInput>(null);

  const handleCreateChore = async () => {
    if (!newChoreName.trim()) return;
    try {
      const res = await fetch("/api/chores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newChoreName }),
      });
      if (res.ok) {
        setNewChoreName("");
        setShowCreateChore(false);
        setFocusedInput(null);
        // Refetch all data
        await refetchData();
      }
    } catch (err) {
      console.error("Failed to create chore:", err);
    }
  };

  const handleKeyboardInput = (char: string) => {
    if (focusedInput === "choreName") {
      if (char === "\b") {
        setNewChoreName((prev) => prev.slice(0, -1));
      } else {
        setNewChoreName((prev) => prev + char);
      }
    } else if (focusedInput === "assigneeName") {
      if (char === "\b") {
        setNewAssigneeName((prev) => prev.slice(0, -1));
      } else {
        setNewAssigneeName((prev) => prev + char);
      }
    }
  };

  const handleCreateAssignee = async () => {
    if (!newAssigneeName.trim()) return;
    try {
      const res = await fetch("/api/assignees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAssigneeName }),
      });
      if (res.ok) {
        setNewAssigneeName("");
        setShowCreateAssignee(false);
        setFocusedInput(null);
        // Refetch all data
        await refetchData();
      }
    } catch (err) {
      console.error("Failed to create assignee:", err);
    }
  };

  const handleDeleteChore = async (choreId: number) => {
    // Check for related assignments
    const relatedAssignments = assignments.filter(a => a.chore_id === choreId);
    const choreName = chores.find(c => c.id === choreId)?.name;
    
    let confirmed = true;
    if (relatedAssignments.length > 0) {
      confirmed = confirm(`Are you sure? "${choreName}" has ${relatedAssignments.length} assignment${relatedAssignments.length !== 1 ? 's' : ''}.`);
    }
    
    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/chores/${choreId}`, { method: "DELETE" });
      if (res.ok) {
        await refetchData();
      }
    } catch (err) {
      console.error("Failed to delete chore:", err);
    }
  };

  const handleDeleteAssignee = async (assigneeId: number) => {
    // Check for related assignments
    const relatedAssignments = assignments.filter(a => a.assignee_id === assigneeId);
    const assigneeName = assignees.find(a => a.id === assigneeId)?.name;
    
    let confirmed = true;
    if (relatedAssignments.length > 0) {
      confirmed = confirm(`Are you sure? "${assigneeName}" has ${relatedAssignments.length} chore${relatedAssignments.length !== 1 ? 's' : ''} listed.`);
    }
    
    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/assignees/${assigneeId}`, { method: "DELETE" });
      if (res.ok) {
        await refetchData();
      }
    } catch (err) {
      console.error("Failed to delete assignee:", err);
    }
  };

  const handleDeleteAssignment = async (choreId: number, assigneeId: number) => {
    try {
      const res = await fetch(`/api/assignments/${choreId}/${assigneeId}`, { method: "DELETE" });
      if (res.ok) {
        await refetchData();
      }
    } catch (err) {
      console.error("Failed to delete assignment:", err);
    }
  };

  const handleAssignChore = async () => {
    if (!selectedChoreId || !selectedAssigneeId || selectedDays.length === 0) {
      alert("Please select a chore, person, and at least one day");
      return;
    }
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chore_id: selectedChoreId,
          assignee_id: selectedAssigneeId,
          weekdays: selectedDays,
        }),
      });
      if (res.ok) {
        // Reset modal
        setShowAssignChore(false);
        setSelectedChoreId(null);
        setSelectedAssigneeId(null);
        setSelectedDays([]);
        // Refetch all data
        await refetchData();
      }
    } catch (err) {
      console.error("Failed to assign chore:", err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading chores...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chores</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdmin(true)}
            className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Admin
          </button>
          <button
            onClick={resetAllAssignments}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Weekly Schedule - 7 columns */}
      <div className="mb-8 border border-gray-300 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0">
          {WEEKDAYS.map((day, i) => (
            <div key={i} className={`bg-gray-600 text-white py-2 text-center font-bold border-r border-white ${i === 6 ? 'border-r-0' : ''}`}>
              <p className="text-sm">{day}</p>
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        <div className="grid grid-cols-7 gap-0 min-h-[400px]">
          {WEEKDAYS.map((_, dayIndex) => (
            <div key={dayIndex} className={`p-3 border-r border-gray-200 ${dayIndex === 6 ? 'border-r-0' : ''} overflow-y-auto`}>
              <ul className="space-y-1.5">
                {assignments
                  .filter((a) => a.weekday === dayIndex)
                  .map((assignment, idx) => {
                    const chore = chores.find((c) => c.id === assignment.chore_id);
                    const assignee = assignees.find((a) => a.id === assignment.assignee_id);
                    return (
                      <li key={idx} className="flex items-start gap-2 text-xs p-1.5 bg-blue-50 rounded hover:bg-blue-100 transition">
                        <input
                          type="checkbox"
                          checked={assignment.completed}
                          onChange={() =>
                            toggleAssignmentComplete(assignment.chore_id, assignment.assignee_id, assignment.weekday)
                          }
                          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        />
                        <span className={assignment.completed ? "line-through text-gray-400" : "font-medium"}>
                          <div>{assignee?.name}</div>
                          <div className="text-gray-600">{chore?.name}</div>
                        </span>
                      </li>
                    );
                  })}
              </ul>
              {assignments.filter((a) => a.weekday === dayIndex).length === 0 && (
                <p className="text-gray-300 text-xs">—</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Admin Modal */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Admin</h2>
              <button
                onClick={() => setShowAdmin(false)}
                className="text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                ×
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              {(["chores", "people", "assignments"] as AdminTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAdminTab(tab)}
                  className={`flex-1 py-2 text-sm font-medium transition ${
                    adminTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab === "chores" ? "Chores" : tab === "people" ? "People" : "Assignments"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {/* Chores Tab */}
              {adminTab === "chores" && (
                <div>
                  <button
                    onClick={() => setShowCreateChore(true)}
                    className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-3"
                  >
                    + Add Chore
                  </button>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {chores.map((chore) => (
                      <div key={chore.id} className="p-2 bg-gray-50 border border-gray-200 rounded text-sm flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{chore.name}</p>
                          {chore.description && <p className="text-gray-500 text-xs">{chore.description}</p>}
                        </div>
                        <button onClick={() => handleDeleteChore(chore.id)} className="ml-2 text-red-500 hover:text-red-700 font-bold">×</button>
                      </div>
                    ))}
                    {chores.length === 0 && <p className="text-gray-400 text-sm p-2">No chores yet</p>}
                  </div>
                </div>
              )}

              {/* People Tab */}
              {adminTab === "people" && (
                <div>
                  <button
                    onClick={() => setShowCreateAssignee(true)}
                    className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-3"
                  >
                    + Add Person
                  </button>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {assignees.map((assignee) => (
                      <div key={assignee.id} className="p-2 bg-gray-50 border border-gray-200 rounded text-sm flex justify-between items-center">
                        <p className="font-medium">{assignee.name}</p>
                        <button onClick={() => handleDeleteAssignee(assignee.id)} className="ml-2 text-red-500 hover:text-red-700 font-bold">×</button>
                      </div>
                    ))}
                    {assignees.length === 0 && <p className="text-gray-400 text-sm p-2">No people yet</p>}
                  </div>
                </div>
              )}

              {/* Assignments Tab */}
              {adminTab === "assignments" && (
                <div>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setShowAssignChore(true)}
                      className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      + Assign Chore
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Remove all assignments?")) {
                          try {
                            // Delete each assignment
                            for (const assignment of assignments) {
                              await fetch(`/api/assignments/${assignment.chore_id}/${assignment.assignee_id}`, {
                                method: "DELETE",
                              });
                            }
                            // Refetch data
                            await refetchData();
                          } catch (err) {
                            console.error("Failed to remove all assignments:", err);
                          }
                        }
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Remove All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {assignments.length === 0 && <p className="text-gray-400 text-sm p-2">No assignments yet</p>}
                    {assignments.map((assignment, idx) => {
                      const chore = chores.find((c) => c.id === assignment.chore_id);
                      const assignee = assignees.find((a) => a.id === assignment.assignee_id);
                      const day = WEEKDAYS[assignment.weekday];
                      return (
                        <div key={idx} className="p-2 bg-gray-50 border border-gray-200 rounded text-sm flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{assignee?.name} - {chore?.name}</p>
                            <p className="text-xs text-gray-500">{day}</p>
                          </div>
                          <button onClick={() => handleDeleteAssignment(assignment.chore_id, assignment.assignee_id)} className="ml-2 text-red-500 hover:text-red-700 font-bold">×</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowAdmin(false)}
                className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TODO: Implement modals for creating/assigning */}

      {/* Create Chore Modal */}
      {showCreateChore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Create Chore</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chore Name</label>
                <input
                  type="text"
                  placeholder="e.g., Dishes"
                  value={newChoreName}
                  onChange={(e) => setNewChoreName(e.target.value)}
                  onFocus={() => setFocusedInput("choreName")}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              {focusedInput === "choreName" && (
                <div className="mt-3">
                  <OnScreenKeyboard onInput={handleKeyboardInput} />
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCreateChore(false);
                  setFocusedInput(null);
                }}
                className="px-3 py-2 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChore}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignee Modal */}
      {showCreateAssignee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Add Person</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Person Name</label>
                <input
                  type="text"
                  placeholder="e.g., Alice"
                  value={newAssigneeName}
                  onChange={(e) => setNewAssigneeName(e.target.value)}
                  onFocus={() => setFocusedInput("assigneeName")}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              {focusedInput === "assigneeName" && (
                <div className="mt-3">
                  <OnScreenKeyboard onInput={handleKeyboardInput} />
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCreateAssignee(false);
                  setFocusedInput(null);
                }}
                className="px-3 py-2 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignee}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Chore Modal */}
      {showAssignChore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Assign Chore</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chore</label>
                <select
                  value={selectedChoreId || ""}
                  onChange={(e) => setSelectedChoreId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select a chore...</option>
                  {chores.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Person</label>
                <select
                  value={selectedAssigneeId || ""}
                  onChange={(e) => setSelectedAssigneeId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select a person...</option>
                  {assignees.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                <div className="grid grid-cols-2 gap-2">
                  {WEEKDAYS.map((day, i) => (
                    <label key={i} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(i)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDays([...selectedDays, i]);
                          } else {
                            setSelectedDays(selectedDays.filter(d => d !== i));
                          }
                        }}
                        className="mr-2"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAssignChore(false);
                  setSelectedChoreId(null);
                  setSelectedAssigneeId(null);
                  setSelectedDays([]);
                }}
                className="px-3 py-2 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button onClick={handleAssignChore} className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition">
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoresPage;
