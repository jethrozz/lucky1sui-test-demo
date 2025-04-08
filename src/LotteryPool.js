import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
export function LotteryPool({ lotteryPoolId }) {
    const currentAccount = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const { data, isPending, error } = useSuiClientQuery("getObject", {
        id: lotteryPoolId,
        options: {
            showContent: true,
            showOwner: true,
        },
    });
    //console.log("data", data);
    const [digest, setDigest] = useState("");
    const [message, setMessage] = useState("");
    const lucky1suiPackageId = useNetworkVariable("lucky1suiPackageId");
    //
    const lotteryId = useNetworkVariable("lotteryId");
    const ticketPoolId = useNetworkVariable("ticketPoolId");
    const clockId = useNetworkVariable("clockId");
    const randomId = useNetworkVariable("randomId");
    function joinLotteryPool() {
        console.log("currentAccount", currentAccount);
        if (!currentAccount) {
            setMessage("Please connect your wallet first");
            return;
        }
        try {
            const tx = new Transaction();
            const [suiCoin] = tx.splitCoins(tx.gas, [1000000000]); // 分割 SUI 代币
            if (!suiCoin)
                throw new Error("Failed to split SUI coins"); // 如果分割失败，抛出错误
            tx.moveCall({
                arguments: [tx.object(lotteryId), tx.object(lotteryPoolId), tx.object(ticketPoolId), suiCoin, tx.object(clockId), tx.object(randomId)],
                target: `${lucky1suiPackageId}::lottery::joinLotteryPool`,
            });
            /**
             *         lottery: &Lottery,
            lotteryPool: &mut LotteryPool,
            ticketPool: &mut TicketPool,
            depositCoin: Coin<SUI>,
            clock: &Clock,
            random: &Random,
             */
            // 清除之前的消息
            setMessage("");
            setDigest("");
            // 签名并执行交易
            signAndExecuteTransaction({ transaction: tx, chain: "sui:testnet" }, {
                onSuccess: (result) => {
                    // 成功时打印结果
                    console.log("Transaction successful:", result);
                    // 设置交易摘要
                    setDigest(result.digest);
                },
                onError: (error) => {
                    console.error("Transaction failed:", error);
                    setMessage(error.message || "Transaction failed");
                },
            });
        }
        catch (error) {
            console.error("Transaction failed:", error);
            setMessage(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }
    function exitLotteryPool() {
        const currentAccount = useCurrentAccount();
        if (!currentAccount) {
            setMessage("Please connect your wallet first");
            return;
        }
    }
    function drawLottery() {
        const currentAccount = useCurrentAccount();
        if (!currentAccount) {
            setMessage("Please connect your wallet first");
            return;
        }
    }
    if (isPending)
        return _jsx(Text, { children: "Loading..." });
    if (error)
        return _jsxs(Text, { children: ["Error: ", error.message] });
    if (!data.data)
        return _jsx(Text, { children: "Not found" });
    return (_jsxs("div", { children: [_jsxs(Heading, { size: "3", children: ["Lottery Pool : ", getPoolInfo(data.data)] }), _jsxs(Flex, { direction: "column", gap: "2", children: [_jsxs(Text, { children: ["message: ", message] }), _jsxs(Text, { children: ["digest: ", digest] }), _jsxs(Text, { children: ["\u4F60\u5F53\u524D\u5DF2\u53C2\u4E0E: ", isPending ? "loading..." : getCoinValue(currentAccount?.address, data.data), " sui"] }), _jsx(Button, { onClick: joinLotteryPool, children: "Join Lottery Pool" })] })] }));
}
function getCoinValue(address, data) {
    console.log("data", data);
    if (!data) {
        return 0;
    }
    if (data.content?.dataType !== "moveObject") {
        return 0;
    }
    let { user_deposit } = data.content.fields;
    let list = user_deposit.fields.contents;
    for (let i = 0; i < list.length; i++) {
        let { fields } = list[i];
        let { key, value } = fields;
        if (key === address) {
            console.log("value", value);
            return value / 1000000000;
        }
    }
}
function getPoolInfo(data) {
    if (!data) {
        return 0;
    }
    if (data.content?.dataType !== "moveObject") {
        return 0;
    }
    let { name, no } = data.content.fields;
    return name + " #" + no;
}
