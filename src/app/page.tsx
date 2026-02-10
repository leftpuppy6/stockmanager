"use client";
import { api } from "@/trpc/react";
import { ItemRow } from "./_components/ItemRow";
import { useItemMutations } from "@/hooks/useItemMutation";

export default function Home() {
  const { data: items, isLoading } = api.item.list.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const {
    handleAdd,
    handleReduce,
    handleDelete,
    handleCreate,
    newItemName,
    setNewItemName,
    isPending,
    locations,
    handleUpdateLocation,
    handleUpdateThreshold,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    handleTogglePurchase,
  } = useItemMutations();

  if (isLoading)
    return (
      <div className="flex justify-center p-20 text-gray-400">
        読み込み中...
      </div>
    );

  return (
    // SP向けに左右の余白を調整 (px-4)ß
    <main
      className="mx-auto max-w-2xl touch-manipulation p-4 pb-24 select-none"
      onContextMenu={(e) => e.preventDefault()} // 右クリック/長押しメニュー禁止
    >
      <header className="py-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          在庫一覧
        </h1>
        <p className="text-sm text-gray-500">
          現在のストックを確認・管理します
        </p>
      </header>

      {/* 新規追加フォーム：カードスタイルにして少し浮かせる */}
      <div className="mb-10 space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
          新規アイテム登録
        </p>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="食材・日用品の名前"
            className="w-full rounded-xl border-0 bg-gray-50 p-3 transition-all outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              className="flex-1 rounded-xl border-0 bg-gray-50 p-3 text-sm outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreate}
              disabled={isPending || !newItemName}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-30"
            >
              追加
            </button>
          </div>
        </div>
      </div>

      {/* 場所別表示セクション */}
      <div className="space-y-12">
        {locations.map((loc) => {
          const itemsInLocation =
            items?.filter((item) => item.stocks[0]?.locationId === loc.id) ??
            [];
          if (itemsInLocation.length === 0) return null;

          return (
            <section
              key={loc.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <h2 className="mb-4 flex items-center gap-2 text-sm font-black tracking-widest text-gray-400 uppercase">
                <span className="rounded-lg bg-gray-100 p-1.5 text-gray-600">
                  📍
                </span>
                {loc.name}
                <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
                  {itemsInLocation.length}
                </span>
              </h2>

              {/* アイテム一覧をカードの集合体に */}
              <div className="grid gap-3">
                {itemsInLocation.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onAdd={handleAdd}
                    onReduce={handleReduce}
                    onDelete={handleDelete}
                    isPending={isPending}
                    onUpdateLocation={handleUpdateLocation}
                    locations={locations}
                    onUpdateThreshold={handleUpdateThreshold}
                    onTogglePurchase={handleTogglePurchase}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
