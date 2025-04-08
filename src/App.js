import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { LotteryPool } from "./LotteryPool";
import { useNetworkVariable } from "./networkConfig";
function App() {
    const currentAccount = useCurrentAccount();
    const lotteryPoolId = useNetworkVariable("lotteryPoolId");
    return (_jsxs(_Fragment, { children: [_jsxs(Flex, { position: "sticky", px: "4", py: "2", justify: "between", style: {
                    borderBottom: "1px solid var(--gray-a2)",
                }, children: [_jsx(Box, { children: _jsx(Heading, { children: "lucky1sui demo" }) }), _jsx(Box, { children: _jsx(ConnectButton, {}) })] }), _jsx(Container, { children: _jsx(Container, { mt: "5", pt: "2", px: "4", style: { background: "var(--gray-a2)", minHeight: 500 }, children: currentAccount ? _jsx(LotteryPool, { lotteryPoolId: lotteryPoolId }) : (_jsx(Heading, { children: "Please connect your wallet" })) }) })] }));
}
export default App;
