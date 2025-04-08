import { getFullnodeUrl } from "@mysten/sui/client";
import {
  TESTNET_COUNTER_PACKAGE_ID,
  TESTNET_LUCKY1SUI_PACKAGE_ID,
  LOTTERY_ID,
  RANDOM_ID,
  TICKET_POOL_ID,
  CLOCK_ID,
  LOTTERY_POOL_ID,
  
} from "./constants.ts";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        lucky1suiPackageId: TESTNET_LUCKY1SUI_PACKAGE_ID,
        counterPackageId: TESTNET_COUNTER_PACKAGE_ID,
        lotteryId: LOTTERY_ID,
        ticketPoolId: TICKET_POOL_ID,
        clockId: CLOCK_ID,
        randomId: RANDOM_ID,
        lotteryPoolId: LOTTERY_POOL_ID
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        lucky1suiPackageId: TESTNET_LUCKY1SUI_PACKAGE_ID,
        counterPackageId: TESTNET_COUNTER_PACKAGE_ID,
        lotteryId: LOTTERY_ID,
        ticketPoolId: TICKET_POOL_ID,
        clockId: CLOCK_ID,
        randomId: RANDOM_ID,
        lotteryPoolId: LOTTERY_POOL_ID

      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        lucky1suiPackageId: TESTNET_LUCKY1SUI_PACKAGE_ID,
        lotteryId: LOTTERY_ID,
        ticketPoolId: TICKET_POOL_ID,
        clockId: CLOCK_ID,
        randomId: RANDOM_ID,
        lotteryPoolId: LOTTERY_POOL_ID
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
