import { api } from "@/trpc/react";
import { useState } from "react"

export function useItemMutations() {
    const utils = api.useUtils();
    const { data: locations } = api.item.locationList.useQuery();
    const { data: categories } = api.item.categoryList.useQuery();

    const [newItemName, setNewItemName] = useState("");
    const [ selectedCategoryId, setSelectedCategoryId ] = useState<number>(1);

    const addMutation = api.item.add.useMutation({
        onMutate: async(variables) => {
            // refetchをキャンセルし、古いデータでの上書き防止
            await utils.item.list.cancel();
            // キャッシュをバックアップとして保存
            const previousItems = utils.item.list.getData();
            // キャッシュを直接書き換え、画面を更新
            utils.item.list.setData(undefined, (old) => {
                if (!old) return old;
                return old.map((item) => {
                    const targetStock = item.stocks.find(s => s.id === variables.stockId);
                    if(targetStock) {
                        const newTotal = item.totalStock + variables.amount;
                        return {
                            ...item,
                            totalStock: newTotal,
                            isAlert: newTotal <= (item.stocks[0]?.threshold ?? 0),
                        };
                    }
                    return item;
                });
            });
            // 失敗時は古いデータを返す。
            return { previousItems };
        },
        // 失敗時はバックアップに戻す。
        onError: (err, variables, context) => {
            if (context?.previousItems) {
                utils.item.list.setData(undefined, context.previousItems);
            }
            alert("更新に失敗しました。");
        },
        // 
        onSettled: () => {
            void utils.item.list.invalidate();
        },
        // onSuccess: () => {
        // void utils.item.list.invalidate();
        // }
    })
    const reduceMutation = api.item.reduce.useMutation({
        onMutate: async(variables) => {
            await utils.item.list.cancel();
            const previousItems = utils.item.list.getData();

            utils.item.list.setData(undefined, (old) => {
                if (!old) return old;
                return old.map((item) => {
                    const targetStock = item.stocks.find(s => s.id === variables.stockId);
                    if(targetStock) {
                        const newTotal = item.totalStock - variables.amount;
                        return {
                            ...item,
                            totalStock: newTotal,
                            isAlert: newTotal <= (item.stocks[0]?.threshold ?? 0),
                        };
                    }
                    return item;
                });
            });
            return { previousItems };
        },
        onError: (err, variables, context) => {
            if (context?.previousItems) {
                utils.item.list.setData(undefined, context.previousItems);
            }
            alert("更新に失敗しました。");
        },
        // 
        onSettled: () => {
            void utils.item.list.invalidate();
        },
        // onSuccess: () => {
        // void utils.item.list.invalidate();
        // }
    });


    const createMutation = api.item.create.useMutation({
        onSuccess: () => {
            void utils.item.list.invalidate();
            setNewItemName("");
        }
    });

    const deleteMutation = api.item.delete.useMutation({ onSuccess: () => void utils.item.list.invalidate()});

    const locationMutation = api.item.updateLocation.useMutation({
        onSuccess: () => void utils.item.list.invalidate(),
    });

    const updateThresholdMutation = api.item.updateThreshold.useMutation({
        onSuccess: () => void utils.item.list.invalidate(),
    });

    const purchaseMutation = api.item.updatePurchaseFlag.useMutation({
        onSuccess: () => void utils.item.list.invalidate(),
    })

    const handleCreate = () => {
    if (!newItemName) return;
    createMutation.mutate({ 
        name: newItemName, 
        categoryId: selectedCategoryId, // ここがDBのCategoryテーブルのIDと一致している必要があります
        threshold: 1,
        locationId: 1 
    });
};

    const handleDelete = (id: number) => {
        deleteMutation.mutate({ id });
    };

    const handleReduce = (stockId: number) => {
        reduceMutation.mutate({stockId, amount: 1});
    }

    const handleAdd = (stockId: number) => {
        addMutation.mutate({stockId, amount: 1});
    }

    const handleUpdateLocation = (stockId: number, locationId: number) => {
        locationMutation.mutate({ stockId, locationId });
    };

    const handleUpdateThreshold = (stockId: number, threshold: number) => {
        updateThresholdMutation.mutate({ stockId, threshold });
    };

    const handleTogglePurchase = (itemId: number, currentFlag: boolean) => {
        purchaseMutation.mutate({ itemId, purchaseFlag: !currentFlag });
    }

    return { 
        handleAdd, 
        handleReduce, 
        handleDelete, 
        handleCreate, 
        newItemName,
        setNewItemName,
        isPending: addMutation.isPending || reduceMutation.isPending || deleteMutation.isPending || createMutation.isPending, 
        locations: locations ?? [],
        handleUpdateLocation,
        handleUpdateThreshold,
        categories: categories ?? [],
        selectedCategoryId,
        setSelectedCategoryId,
        handleTogglePurchase,
    };
}