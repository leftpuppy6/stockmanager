    "use client";
    import { api } from "@/trpc/react";
    import Link from "next/link";
    import { useState } from "react";
import { useCategoryMutations } from "@/hooks/useCategoryMutation";

export default function CategoryMasterPage() {
  const {
    categories,
    isLoading,
    newCatName,
    setNewCatName,
    handleCreate,
    handleUpdate,
    handleDelete,
    isPending,
  } = useCategoryMutations();

  if (isLoading) return <div className="p-10 text-center text-gray-400">読み込み中...</div>;
  return (
    <main className="p-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">カテゴリマスタ管理</h1>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← 在庫一覧に戻る
        </Link>
        </div>

        {/* 新規登録エリア */}
        <div className="mb-8 flex gap-2">
        <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="新しいカテゴリ名"
            className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
            onClick={() => handleCreate()}
            disabled={!newCatName || isPending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
            追加
        </button>
        </div>

        {/* カテゴリ一覧テーブル */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
            <tr>
                <th className="p-4 font-semibold text-sm text-gray-600">カテゴリ名 (クリックで編集)</th>
                <th className="p-4 font-semibold text-sm text-gray-600 w-24 text-center">商品数</th>
                <th className="p-4 w-16"></th>
            </tr>
            </thead>
            <tbody className="divide-y">
            {categories?.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                    <input
                    type="text"
                    defaultValue={cat.name}
                    onBlur={(e) => {
                        if (e.target.value !== cat.name) {
                        handleUpdate(cat.id, e.target.value);
                        }
                    }}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-300 rounded px-2 py-1 outline-none"
                    />
                </td>
                <td className="p-4 text-center text-gray-500 text-sm">
                    {cat._count.items}
                </td>
                <td className="p-4 text-right">
                    <button
                    onClick={() => {
                        if (confirm(`カテゴリ「${cat.name}」を削除しますか？`)) {
                        handleDelete(cat.id);
                        }
                    }}
                    disabled={isPending}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                    🗑️
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </main>
    );
}