/* KanbanNewPage.tsx */
import type { DragEvent } from "react";
import { useState, useRef } from "react";
import Column from "./column";

export interface Item {
  id: string;
  text: string;
}
export interface List {
  id: string;
  title: string;
  items: Item[];
}

const initial: List[] = [
  {
    id: "todo",
    title: "To Do",
    items: [
      { id: "1", text: "Learn Nestjs" },
      { id: "2", text: "Wash dishes" },
    ],
  },
  {
    id: "doing",
    title: "In Progress",
    items: [{ id: "3", text: "Read English Materials" }],
  },
  { id: "done", title: "Done", items: [{ id: "4", text: "Take Exercise" }] },
];

/* 纯数据移动函数 */
function moveItem(
  arr: List[],
  from: string,
  to: string,
  id: string,
  beforeId?: string
): List[] {
  const lists = structuredClone(arr);
  const src = lists.find((l) => l.id === from)!;
  const dst = lists.find((l) => l.id === to)!;
  const idx = src.items.findIndex((i) => i.id === id);
  const [moving] = src.items.splice(idx, 1);
  if (beforeId) {
    const pos = dst.items.findIndex((i) => i.id === beforeId);
    dst.items.splice(pos, 0, moving);
  } else {
    dst.items.push(moving);
  }
  return lists;
}

/*
The 4 Basic Steps to Implement Drag and Drop
  1. Make Something Draggable
     add 'draggable' to elemeng;
  2. Create a Drop Zone
      onDragOver={(e) => {
        e.preventDefault(); // ← WITHOUT this, drop won't work!
      }}
  3. Handle the Data Transfer
      e.dataTransfer.setData()
      e.dataTransfer.getData("text/plain")
  4. Update Your State

*/

export default function KanbanNewPage() {
  const [lists, setLists] = useState(initial);
  // why use useRef to store data? for performance optimization, update data won't trigger re-rendering;
  const dragged = useRef<{ listId: string; itemId: string } | null>(null);

  /* ----------  start dragging ---------- */
  // opportunity: user press button and move(must move mouse)
  const onDragStart = (e: DragEvent, listId: string, itemId: string) => {
    dragged.current = { listId, itemId };
    // it's not 'dropEffect' from Column component;
    // it's used to declare that which operations it allow
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify({ listId, itemId }));
    // this is DOM API, true means deep copy(including children elements);
    // it's used to create a preview element before droping element;
    const ghost = (e.target as HTMLElement).cloneNode(true) as HTMLElement;

    // ! preserve the original width by getting the computed width before positioning off-screen
    const originalWidth = (e.target as HTMLElement).offsetWidth;
    // why using this style: we just need it during drag-drop, we don't want other elements being afftected, so give it 'top:-9999px'
    ghost.style.cssText = `position:absolute;top:-9999px;opacity:.5;width:${originalWidth}px;`;
    document.body.appendChild(ghost);

    // ! set up the position of the preview element and the cursor
    // Calculate the offset for better cursor positioning
    // * Option 1: Center the cursor on the ghost element
    const offsetX = originalWidth / 2;
    const offsetY = (e.target as HTMLElement).offsetHeight / 2;
    e.dataTransfer.setDragImage(ghost, offsetX, offsetY);

    // * Option 2: Use the actual mouse position relative to the element (uncomment if you prefer this)
    // const rect = (e.target as HTMLElement).getBoundingClientRect();
    // const offsetX = e.clientX - rect.left;
    // const offsetY = e.clientY - rect.top;

    // original code
    // e.dataTransfer.setDragImage(ghost, 0, 0);
    // preview end

    // used to remove clone element, setTimeout(0) means it execute after setDragImage
    setTimeout(() => ghost.remove(), 0);
  };

  /* ---------- 放下到列底部 ---------- */
  const onDropColumn = (e: DragEvent, targetListId: string) => {
    e.preventDefault();
    const { listId, itemId } =
      dragged.current ?? JSON.parse(e.dataTransfer.getData("text/plain"));
    if (!itemId) return;
    if (
      listId === targetListId &&
      lists.find((l) => l.id === targetListId)?.items.at(-1)?.id === itemId
    )
      return;
    setLists((prev) => moveItem(prev, listId, targetListId, itemId));
  };

  /* ---------- start dropping ---------- */
  // opportunity：user loose button
  const onDropCard = (e: DragEvent, targetListId: string, beforeId: string) => {
    e.preventDefault();
    const { listId, itemId } =
      dragged.current ?? JSON.parse(e.dataTransfer.getData("text/plain"));
    if (!itemId || (listId === targetListId && itemId === beforeId)) return;
    setLists((prev) => moveItem(prev, listId, targetListId, itemId, beforeId));
  };

  /* ---------- 清理 ---------- */
  // no matter success or failure, it will execute
  const onDragEnd = () => {
    dragged.current = null;
  };

  return (
    // max width + w-full, they are a common used pair
    <div className="max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-center my-6">
        Kanban (Optimization)
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lists.map((list) => (
          <Column
            key={list.id}
            list={list}
            onDragStart={onDragStart}
            onDropColumn={onDropColumn}
            onDropCard={onDropCard}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
