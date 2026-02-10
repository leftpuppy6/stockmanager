import { useState } from "react";
import { api } from "@/trpc/react";

export const useCategoryMutations = () => {
  const utils = api.useUtils();
  const [newCatName, setNewCatName] = useState("");

  // 1. カテゴリ一覧の取得
  const { data: categories, isLoading } = api.category.list.useQuery();

  // 共通のキャッシュ更新処理
  const invalidateAll = async () => {
    await utils.category.list.invalidate();
    // 在庫一覧側のプルダウンなども更新が必要な場合はここに追加
    await utils.item.list.invalidate();
  };

  const createMutation = api.category.create.useMutation({
    onSuccess: () => {
      void invalidateAll();
      setNewCatName("");
    },
  });

  const updateMutation = api.category.update.useMutation({
    onSuccess: () => void invalidateAll(),
  });

  const deleteMutation = api.category.delete.useMutation({
    onSuccess: () => void invalidateAll(),
    onError: (err) => alert(err.message),
  });

  return {
    categories,
    isLoading,
    newCatName,
    setNewCatName,
    handleCreate: () => createMutation.mutate({ name: newCatName }),
    handleUpdate: (id: number, name: string) =>
      updateMutation.mutate({ id, name }),
    handleDelete: (id: number) => deleteMutation.mutate({ id }),
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};
