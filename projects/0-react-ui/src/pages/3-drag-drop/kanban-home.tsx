// TODO 原生拖拽事件实现

import KanbanPage from "./kanban";
import KanbanDndkit from "./kanban-dndkit";
import KanbanNewPage from "./optimization/kanban-optimize";

const DragDropPage = () => {
  return (
    <div className="bg-blue-50 h-screen flex flex-col gap-4 justify-center items-center">
      <KanbanPage />
      <KanbanDndkit />
      <KanbanNewPage />
    </div>
  );
};

export default DragDropPage;
