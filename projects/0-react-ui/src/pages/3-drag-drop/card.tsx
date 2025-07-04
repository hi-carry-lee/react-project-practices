import Item from "./item";
// 列（每一块）
function Card({
  title,
  items,
  listId,
  onDragStart,
  onDropItem,
  onDragOverItem,
  onDropToList,
  onDragOverList,
  overItemId,
  overListId,
  isLastOver,
}: {
  title: string;
  items: { id: string; text: string }[];
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
  onDropToList: (e: React.DragEvent, targetListId: string) => void;
  onDragOverList: (e: React.DragEvent, targetListId: string) => void;
  overItemId: string;
  overListId: string;
  isLastOver: boolean;
}) {
  return (
    <div className="bg-neutral-200 p-4 rounded-xl shadow-lg h-96 transition-all flex flex-col">
      <h2 className="text-center text-2xl text-slate-500 font-bold">{title}</h2>
      <div className="mt-4 flex-1 space-y-2 flex flex-col">
        {items.map((item) => (
          <Item
            key={item.id}
            text={item.text}
            itemId={item.id}
            listId={listId}
            onDragStart={onDragStart}
            onDropItem={onDropItem}
            onDragOverItem={onDragOverItem}
            isOver={overListId === listId && overItemId === item.id}
          />
        ))}
        {/* Card最底部空白可投放区 */}
        <div
          style={{ minHeight: 36 }}
          className={`flex-1 ${
            isLastOver ? "outline outline-blue-400 outline-dashed" : ""
          }`}
          onDragOver={(e) => onDragOverList(e, listId)}
          onDrop={(e) => onDropToList(e, listId)}
          onDragLeave={(e) => onDragOverList(e, "")}
        />
      </div>
    </div>
  );
}

export default Card;
