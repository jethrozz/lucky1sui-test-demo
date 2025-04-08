import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { LotteryPool } from "./LotteryPool";
import { useNetworkVariable } from "./networkConfig";
function App() {
  const currentAccount = useCurrentAccount();
  const lotteryPoolId = useNetworkVariable("lotteryPoolId");

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
