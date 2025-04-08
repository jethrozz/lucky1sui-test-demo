import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useCurrentAccount, useSignAndExecuteTransaction,  useSuiClient,
    useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { SuiObjectData } from "@mysten/sui/client";



export function LotteryPool({ lotteryPoolId }: { lotteryPoolId: string }) {
    const currentAccount = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const { data, isPending, error } = useSuiClientQuery("getObject", {
        id: lotteryPoolId,
        options: {
          showContent: true,
          showOwner: true,
        },
    })
    //console.log("data", data);
    const [digest, setDigest] = useState<string>("");
    const [message, setMessage] = useState<string>("");
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
        const [suiCoin] = tx.splitCoins(tx.gas, [1_000_000_000]); // 分割 SUI 代币
        if (!suiCoin) throw new Error("Failed to split SUI coins"); // 如果分割失败，抛出错误
        tx.moveCall({
            arguments: [tx.object(lotteryId), tx.object(lotteryPoolId), tx.object(ticketPoolId), suiCoin,tx.object(clockId), tx.object(randomId)],
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
                    signAndExecuteTransaction(
                        { transaction: tx, chain: "sui:testnet" },
                        {
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
                        },
                    );
        } catch (error) {
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


    if (isPending) return <Text>Loading...</Text>;

    if (error) return <Text>Error: {error.message}</Text>;
  
    if (!data.data) return <Text>Not found</Text>;

    return (
        <div>
            <Heading size="3">Lottery Pool : {getPoolInfo(data.data)}</Heading>

            <Flex direction="column" gap="2">
                <Text>message: {message}</Text>
                <Text>digest: {digest}</Text>
                <Text>你当前已参与: {isPending ? "loading..." : getCoinValue(currentAccount?.address, data.data)} sui</Text>
                <Button onClick={joinLotteryPool}>Join Lottery Pool</Button>
                {/* <Button onClick={exitLotteryPool}>Exit Lottery Pool</Button>
                <Button onClick={drawLottery}>Draw Lottery</Button> */}
            </Flex>
            
        </div>
    );
    
    
}

function getCoinValue(address: string, data: SuiObjectData | undefined | null) {
    console.log("data", data);
    if (!data) {
        return 0;
    }
    if (data.content?.dataType !== "moveObject") {
        return 0;
    }
    let {user_deposit} = data.content.fields as any;
    let list = user_deposit.fields.contents;
    for (let i = 0; i < list.length; i++) {
        let {fields} = list[i];
        let {key, value} = fields;
        if(key === address) {
            console.log("value", value);
            return value/ 1_000_000_000;
        }
    }
}

function getPoolInfo(data: SuiObjectData | undefined | null) {
    if (!data) {
        return 0;
    }
    if (data.content?.dataType !== "moveObject") {
        return 0;
    }
    let {name, no} = data.content.fields as any;

    return name + " #" + no;
}   
