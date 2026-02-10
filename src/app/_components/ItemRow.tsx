import { type ItemWithAlerts } from "@/server/services/ItemService";
import type { Location } from "@prisma/client";

type Props = {
  item: ItemWithAlerts;
  onAdd: (stockId: number) => void;
  onReduce: (stockId: number) => void;
  onDelete: (stockId: number) => void;
  isPending: boolean;
  onUpdateLocation: (stockId: number, locationId: number) => void;
  locations: Location[];
  onUpdateThreshold: (stockId: number, threshold: number) => void;
  onTogglePurchase: (itemId: number, purchaseFlag: boolean) => void;
};

export function ItemRow({
  item,
  onAdd,
  onReduce,
  onDelete,
  isPending,
  onUpdateLocation,
  locations,
  onUpdateThreshold,
  onTogglePurchase,
}: Props) {
  const stock = item.stocks[0];
  if (!stock) return null;

  const isInactive = !item.purchaseFlag && item.totalStock === 0;

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-2xl border p-4 transition-all ${
        item.isAlert
          ? "border-red-200 bg-red-50/50 shadow-sm shadow-red-100"
          : "border-gray-100 bg-white shadow-sm"
      } ${isInactive ? "opacity-50 grayscale" : ""}`}
    >
      {/* メイン情報  */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTogglePurchase(item.id, item.purchaseFlag)}
              className="text-lg transition-transform active:scale-125"
              title={item.purchaseFlag ? "買い物リスト対象" : "在庫管理のみ"}
            >
              {item.purchaseFlag ? "⭐️" : "☆"}
            </button>
            <h3 className="text-lg leading-tight font-bold text-gray-800">
              {item.name}
            </h3>
            {item.isAlert && (
              <span className="animate-pulse rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white uppercase">
                LOW
              </span>
            )}
          </div>

          {/* 場所と閾値の設定 */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <select
              value={stock.locationId}
              onChange={(e) =>
                onUpdateLocation(stock.id, Number(e.target.value))
              }
              disabled={isPending}
              className="cursor-pointer border-none bg-transparent p-0 font-medium transition-colors hover:text-blue-600 focus:ring-0"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            <span>•</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                className="w-8 border-b border-gray-200 bg-transparent text-center outline-none focus:border-blue-400"
                defaultValue={stock.threshold}
                onBlur={(e) =>
                  onUpdateThreshold(stock.id, Number(e.target.value))
                }
              />
              <span>以下で補充</span>
            </div>
          </div>
        </div>

        {/* 在庫操作 */}
        <div className="flex items-center rounded-xl bg-gray-50 p-1 shadow-inner">
          <button
            onClick={() => onReduce(stock.id)}
            disabled={isPending || item.totalStock <= 0}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-all active:bg-gray-100 disabled:opacity-30"
          >
            －
          </button>
          <span
            className={`w-12 text-center text-xl font-black ${item.isAlert ? "text-red-600" : "text-gray-700"}`}
          >
            {item.totalStock}
          </span>
          <button
            onClick={() => onAdd(stock.id)}
            disabled={isPending}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-all active:bg-gray-100"
          >
            ＋
          </button>
        </div>
      </div>

      {/* 削除ボタン */}
      <button
        onClick={() => {
          if (confirm(`「${item.name}」を完全に削除しますか？`)) {
            onDelete(item.id);
          }
        }}
        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-100 bg-white text-[10px] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
        style={{ opacity: 0.8 }}
      >
        ✕
      </button>
    </div>
  );
}
