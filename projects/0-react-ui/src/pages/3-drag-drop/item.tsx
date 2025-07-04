// 单个卡片（任务）
function Item({
  text,
  itemId,
  listId,
  onDragStart,
  onDropItem,
  onDragOverItem,
  isOver,
}: {
  text: string;
  itemId: string;
  listId: string;
  onDragStart: (e: React.DragEvent, listId: string, itemId: string) => void;
  onDropItem: (
    e: React.DragEvent,
    targetListId: string,
    targetItemId: string
  ) => void;
  onDragOverItem: (
    e: React.DragEvent,
    targetListId: string,
    targetItemId: string
  ) => void;
  isOver: boolean;
}) {
  return (
    <div
      className={`text-center bg-white p-4 rounded-xl shadow-lg mb-2 cursor-move transition-all ${
        isOver ? "outline outline-blue-400 outline-dashed" : ""
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, listId, itemId)}
      onDrop={(e) => onDropItem(e, listId, itemId)}
      onDragOver={(e) => onDragOverItem(e, listId, itemId)}
      onDragLeave={(e) => onDragOverItem(e, "", "")}
    >
      {text}
    </div>
  );
}

export default Item;
