import {
    ConnectButton, useCurrentAccount, useSuiClient,
    useSuiClientQuery } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { LotteryPool } from "./LotteryPool";
import { useNetworkVariable } from "./networkConfig";
import { useEffect, useState } from "react";
function App() {
  const currentAccount = useCurrentAccount();
  const [lotteryPoolId, setLotteryPoolId] = useState<string>("-1");
  const lotteryId = useNetworkVariable("lotteryId");
  const { data, isPending, error } = useSuiClientQuery("getObject", {
        id: lotteryId,
        options: {
            showContent: true,
            showOwner: true,
        },
  });
  console.log("lottery:",data);

  useEffect(() => {
    if (!isPending && data.data?.content) {
      setLotteryPoolId((data.data.content as any).fields.lottery_pool_id as string);
    }
  }, [isPending,data]);
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>lucky1sui demo</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
                  {currentAccount ? <LotteryPool lotteryPoolId={lotteryPoolId} /> : (
            <Heading>Please connect your wallet</Heading>
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;
