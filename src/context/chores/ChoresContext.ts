import { createContext, useContext } from "react";
import { Chore, Assignee, Assignment } from "./ChoresProvider";

interface ChoresContextType {
  chores: Chore[];
  setChores: (chores: Chore[]) => void;
  assignees: Assignee[];
  setAssignees: (assignees: Assignee[]) => void;
  assignments: Assignment[];
  setAssignments: (assignments: Assignment[]) => void;
  loading: boolean;
  toggleAssignmentComplete: (choreId: number, assigneeId: number, weekday: number) => void;
  resetAllAssignments: () => void;
  refetchData: () => Promise<void>;
}

const ChoresContext = createContext<ChoresContextType | undefined>(undefined);

export const useChores = () => {
  const context = useContext(ChoresContext);
  if (!context) {
    throw new Error("useChores must be used within a ChoresProvider");
  }
  return context;
};

export default ChoresContext;
