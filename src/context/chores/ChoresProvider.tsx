"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import ChoresContext from "./ChoresContext";

export interface Chore {
  id: number;
  name: string;
  description: string;
}

export interface Assignee {
  id: number;
  name: string;
}

export interface Assignment {
  chore_id: number;
  assignee_id: number;
  weekday: number;
  completed: boolean;
}

const ChoresProvider = ({ children }: { children: ReactNode }) => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const didMount = useRef(false);

  // Fetch all data on mount
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [choresRes, assigneesRes, assignmentsRes] = await Promise.all([
          fetch("/api/chores"),
          fetch("/api/assignees"),
          fetch("/api/assignments"),
        ]);

        if (choresRes.ok) setChores(await choresRes.json());
        if (assigneesRes.ok) setAssignees(await assigneesRes.json());
        if (assignmentsRes.ok) setAssignments(await assignmentsRes.json());
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleAssignmentComplete = (choreId: number, assigneeId: number, weekday: number) => {
    const assignment = assignments.find(
      (a) => a.chore_id === choreId && a.assignee_id === assigneeId && a.weekday === weekday
    );
    if (!assignment) return;

    const updated = assignment.completed ? false : true;
    fetch(`/api/assignments/${choreId}/${assigneeId}/${weekday}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: updated }),
    })
      .then((res) => {
        if (res.ok) {
          setAssignments(
            assignments.map((a) =>
              a.chore_id === choreId && a.assignee_id === assigneeId && a.weekday === weekday
                ? { ...a, completed: updated }
                : a
            )
          );
        }
      })
      .catch(() => {
        // Handle error silently
      });
  };

  const resetAllAssignments = () => {
    fetch("/api/assignments/reset", { method: "POST" })
      .then((res) => {
        if (res.ok) {
          setAssignments(assignments.map((a) => ({ ...a, completed: false })));
        }
      })
      .catch(() => {
        // Handle error silently
      });
  };

  const refetchData = async () => {
    try {
      const [choresRes, assigneesRes, assignmentsRes] = await Promise.all([
        fetch("/api/chores"),
        fetch("/api/assignees"),
        fetch("/api/assignments"),
      ]);

      if (choresRes.ok) setChores(await choresRes.json());
      if (assigneesRes.ok) setAssignees(await assigneesRes.json());
      if (assignmentsRes.ok) setAssignments(await assignmentsRes.json());
    } catch {
      // Handle error silently
    }
  };

  return (
    <ChoresContext.Provider
      value={{
        chores,
        setChores,
        assignees,
        setAssignees,
        assignments,
        setAssignments,
        loading,
        toggleAssignmentComplete,
        resetAllAssignments,
        refetchData,
      }}
    >
      {children}
    </ChoresContext.Provider>
  );
};

export default ChoresProvider;
