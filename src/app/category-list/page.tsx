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

  if (isLoading)
    return <div className="p-10 text-center text-gray-400">読み込み中...</div>;
  return (
    <main className="mx-auto max-w-2xl p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">カテゴリマスタ管理</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
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
          className="flex-1 rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleCreate()}
          disabled={!newCatName || isPending}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          追加
        </button>
      </div>

      {/* カテゴリ一覧テーブル */}
      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">
                カテゴリ名 (クリックで編集)
              </th>
              <th className="w-24 p-4 text-center text-sm font-semibold text-gray-600">
                商品数
              </th>
              <th className="w-16 p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories?.map((cat) => (
              <tr key={cat.id} className="transition-colors hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="text"
                    defaultValue={cat.name}
                    onBlur={(e) => {
                      if (e.target.value !== cat.name) {
                        handleUpdate(cat.id, e.target.value);
                      }
                    }}
                    className="w-full rounded bg-transparent px-2 py-1 outline-none focus:bg-white focus:ring-1 focus:ring-blue-300"
                  />
                </td>
                <td className="p-4 text-center text-sm text-gray-500">
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
                    className="text-gray-400 transition-colors hover:text-red-600"
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
