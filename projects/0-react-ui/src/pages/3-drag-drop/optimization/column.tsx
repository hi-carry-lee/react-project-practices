/* Column.tsx */
import type { DragEvent } from "react";
import type { List } from "./kanban-new";

interface Props {
  list: List;
  onDragStart: (e: DragEvent, listId: string, itemId: string) => void;
  onDropColumn: (e: DragEvent, listId: string) => void;
  onDropCard: (e: DragEvent, listId: string, beforeId: string) => void;
  onDragEnd: () => void;
}

export default function Column({
  list,
  onDragStart,
  onDropColumn,
  onDropCard,
  onDragEnd,
}: Props) {
  // Create a Drop Zone
  const allow = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <section
      className="bg-slate-200 p-4 rounded-lg min-h-[200px] shadow-lg"
      onDragOver={allow}
      onDrop={(e) => onDropColumn(e, list.id)}
    >
      <h2 className="font-semibold mb-3 text-center text-2xl text-slate-600">
        {list.title}
      </h2>

      {list.items.map((item) => (
        <div
          key={item.id}
          draggable // make the element draggable
          // two handlers for Draggable Element
          onDragStart={(e) => onDragStart(e, list.id, item.id)}
          onDragEnd={onDragEnd}
          // two handlers for Drop Zone
          onDragOver={allow}
          onDrop={(e) => onDropCard(e, list.id, item.id)}
          className="mb-2 p-3 text-center bg-white rounded-lg shadow-lg cursor-move hover:bg-blue-50"
        >
          {item.text}
        </div>
      ))}
    </section>
  );
}
