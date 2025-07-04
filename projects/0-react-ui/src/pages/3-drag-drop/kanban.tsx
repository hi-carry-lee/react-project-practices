import { useState } from "react";
import Card from "./card";

const initialLists = [
  {
    id: "todo",
    title: "To Do",
    items: [
      { id: "1", text: "Learn Nestjs" },
      { id: "2", text: "Wash dishes" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    items: [{ id: "3", text: "Read English Materias" }],
  },
  {
    id: "done",
    title: "Done",
    items: [{ id: "4", text: "Take Exercise" }],
  },
];

const KanbanPage = () => {
  const [lists, setLists] = useState(initialLists);

  // 当前拖拽中的 item
  const [dragged, setDragged] = useState<{
    listId: string;
    itemId: string;
  } | null>(null);
  // 悬停目标
  const [overItem, setOverItem] = useState<{ listId: string; itemId: string }>({
    listId: "",
    itemId: "",
  });
  // 悬停Card底部区
  const [overLastListId, setOverLastListId] = useState<string>("");

  const handleDragStart = (
    e: React.DragEvent,
    listId: string,
    itemId: string
  ) => {
    setDragged({ listId, itemId });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify({ listId, itemId }));
  };

  const handleDragOverItem = (
    e: React.DragEvent,
    targetListId: string,
    targetItemId: string
  ) => {
    e.preventDefault();
    setOverLastListId("");
    setOverItem({ listId: targetListId, itemId: targetItemId });
  };

  const handleDragOverList = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    setOverLastListId(targetListId);
    setOverItem({ listId: "", itemId: "" });
  };

  // 插到指定item上方
  const handleDropItem = (
    e: React.DragEvent,
    targetListId: string,
    targetItemId: string
  ) => {
    e.preventDefault();
    setOverItem({ listId: "", itemId: "" });
    setOverLastListId("");

    let sourceListId, itemId;
    try {
      if (dragged) {
        sourceListId = dragged.listId;
        itemId = dragged.itemId;
      } else {
        ({ listId: sourceListId, itemId } = JSON.parse(
          e.dataTransfer.getData("text/plain")
        ));
      }
    } catch {
      return;
    }
    if (!itemId || !sourceListId) return;
    if (sourceListId === targetListId && itemId === targetItemId) return;

    // 插到目标item前面
    const newLists = lists.map((list) => {
      let { items } = list;
      // 先remove
      if (list.id === sourceListId)
        items = items.filter((item) => item.id !== itemId);

      // 再insert
      if (list.id === targetListId) {
        const movingItem = lists
          .find((l) => l.id === sourceListId)
          ?.items.find((i) => i.id === itemId);
        if (!movingItem) return list;

        const idx = items.findIndex((i) => i.id === targetItemId);
        items = [...items.slice(0, idx), movingItem, ...items.slice(idx)];
      }
      return { ...list, items };
    });

    setLists(newLists);
    setDragged(null);
  };

  // 插到Card底部
  const handleDropToList = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    setOverItem({ listId: "", itemId: "" });
    setOverLastListId("");

    let sourceListId, itemId;
    try {
      if (dragged) {
        sourceListId = dragged.listId;
        itemId = dragged.itemId;
      } else {
        ({ listId: sourceListId, itemId } = JSON.parse(
          e.dataTransfer.getData("text/plain")
        ));
      }
    } catch {
      return;
    }
    if (!itemId || !sourceListId) return;

    // 已在目标列末尾可忽略
    if (
      sourceListId === targetListId &&
      lists.find((l) => l.id === targetListId)?.items.slice(-1)[0]?.id ===
        itemId
    )
      return;

    const newLists = lists.map((list) => {
      let items = list.items;
      if (list.id === sourceListId)
        items = items.filter((item) => item.id !== itemId);

      if (list.id === targetListId) {
        const movingItem = lists
          .find((l) => l.id === sourceListId)
          ?.items.find((i) => i.id === itemId);
        if (!movingItem) return list;
        items = [...items, movingItem];
      }
      return { ...list, items };
    });

    setLists(newLists);
    setDragged(null);
  };

  return (
    <div className="max-w-6xl w-full ">
      <h1 className="text-center text-3xl font-bold">Simple Kanban Board</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {lists.map((list) => (
          <Card
            key={list.id}
            title={list.title}
            items={list.items}
            listId={list.id}
            onDragStart={handleDragStart}
            onDropItem={handleDropItem}
            onDragOverItem={handleDragOverItem}
            onDropToList={handleDropToList}
            onDragOverList={handleDragOverList}
            overItemId={overItem.itemId}
            overListId={overItem.listId}
            isLastOver={overLastListId === list.id}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanPage;
