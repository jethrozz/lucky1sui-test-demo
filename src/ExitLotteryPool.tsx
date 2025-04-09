import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex, Heading, Text, Avatar } from "@radix-ui/themes";
import {
    useCurrentAccount, useSignAndExecuteTransaction, useSuiClient,
    useSuiClientQuery
} from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { SuiObjectData } from "@mysten/sui/client";
import { NFT_TYPE } from "./constants";
type Props = {
    onClose: () => void;
    onExitSuccess?: (nftId: string) => void;
};


export function ExitLotteryPool({ onClose, onExitSuccess }: Props) {
    const account = useCurrentAccount();
    const [selectedNft, setSelectedNft] = useState<string | null>(null);
    const { data, isPending, error } = useSuiClientQuery(
        "getOwnedObjects",
        {
            owner: account?.address as string,
            options: {
                showType: true,
                showDisplay: true,
                showContent: true
            },
            filter: {
                MatchAll: [
                    {
                        StructType: NFT_TYPE, // 指定NFT的类型
                    },
                    {
                        AddressOwner: account?.address || "",
                    },
                ],
            },
        },
        {
            enabled: !!account,
        }
    );
    console.log("nft", data);
    if (!account) {
        return <Text>请连接钱包</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    if (isPending || !data) {
        return <Text>加载中...</Text>;
    }

    if (data.data.length === 0) {
        return <Text>没有找到NFT</Text>;
    }

    return (
        <Flex direction="column" gap="3">
            <Heading size="4">拥有的NFT:</Heading>
            {data.data.map((object) => (
                <Flex 
                    key={object.data?.objectId}
                    align="center" 
                    style={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedNft === object.data?.objectId ? 'var(--accent-3)' : 'transparent',
                        padding: '8px',
                        borderRadius: '4px'
                    }}
                    onClick={() => setSelectedNft(object.data?.objectId || null)}
                >
                    <input
                        type="radio"
                        checked={selectedNft === object.data?.objectId}
                        onChange={() => {}}
                        style={{ marginRight: '8px' }}
                    />
                    <Avatar src={object.data?.display?.data.image_url} alt="NFT" fallback="NFT" />
                    <Text className="ml-2">{object.data?.content?.fields.ticket_number_set[0]}</Text>
                </Flex>
            ))}
            
            <Button 
                onClick={() => {
                    if (selectedNft) {
                        // 这里可以处理选中的NFT值
                        onExitSuccess?.(selectedNft);
                        onClose();
                    }
                }}
                disabled={!selectedNft}
            >
                确认退出
            </Button>
        </Flex>
    );
}