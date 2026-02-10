"use client";
import { api } from "@/trpc/react";
import { ItemRow } from "../_components/ItemRow";
import { useItemMutations } from "@/hooks/useItemMutation";

export default function ShoppingListPage() {
  const { data: items, isLoading } = api.item.list.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const {
    handleAdd,
    handleReduce,
    handleDelete,
    isPending,
    locations,
    handleUpdateLocation,
    handleUpdateThreshold,
    categories,
    handleTogglePurchase,
  } = useItemMutations();

  const shoppingList =
    items?.filter((item) => item.isAlert && item.purchaseFlag) ?? [];
  const unShoppingList =
    items?.filter((item) => item.isAlert && !item.purchaseFlag) ?? [];

  if (isLoading)
    return (
      <div className="flex justify-center p-20 text-gray-400">
        読み込み中...
      </div>
    );

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24">
      {/* --- お買い物リストセクション --- */}
      <header className="flex items-center justify-between py-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-red-600">
            お買い物
          </h1>
          <p className="text-sm text-gray-500">補充が必要なアイテム</p>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-2">
          <span className="text-xl font-black text-red-600">
            {shoppingList.length}
          </span>
          <span className="ml-1 text-[10px] font-bold text-red-400">ITEMS</span>
        </div>
      </header>

      {shoppingList.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-100 bg-white p-10 text-center">
          <span className="mb-2 block text-4xl">🎉</span>
          <p className="font-medium text-gray-400">購入品なし</p>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => {
            const itemsInCategory = shoppingList.filter(
              (item) => item.categoryId === cat.id
            );
            if (itemsInCategory.length === 0) return null;

            return (
              <section
                key={cat.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <h2 className="mb-4 flex items-center gap-2 text-sm font-black tracking-widest text-gray-400 uppercase">
                  <span className="rounded-lg bg-red-50 p-1.5 text-red-500">
                    🏷️
                  </span>
                  {cat.name}
                  <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
                    {itemsInCategory.length}
                  </span>
                </h2>
                <div className="grid gap-3">
                  {itemsInCategory.map((item) => (
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
      )}

      {/* --- 管理外リストセクション --- */}
      {unShoppingList.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-400">
              管理外の在庫切れ
            </h2>
            <p className="text-xs text-gray-400">
              ⭐️を付けると買い物リストに追加されます
            </p>
          </div>

          <div className="space-y-10 opacity-70">
            {categories.map((cat) => {
              const itemsInCategory = unShoppingList.filter(
                (item) => item.categoryId === cat.id
              );
              if (itemsInCategory.length === 0) return null;

              return (
                <section key={cat.id}>
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-bold text-gray-300 uppercase">
                    {cat.name}
                  </h3>
                  <div className="grid gap-3">
                    {itemsInCategory.map((item) => (
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
        </div>
      )}
    </main>
  );
}
