import {task, usePlugin} from "@nomiclabs/buidler/config";
import {BuidlerConfig} from "@nomiclabs/buidler/config";
import dotenv from "dotenv";

dotenv.config();
usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-etherscan");

// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, bre) => {
    const accounts = await bre.ethers.getSigners();

    for (const account of accounts) {
        console.log(await account.getAddress());
    }
});

const config: BuidlerConfig = {
    defaultNetwork: "buidlerevm",
    networks: {
        buidlerevm: {
            chainId: 31337,
            blockGasLimit: 12500000,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
            chainId: 4,
            accounts: {
                mnemonic: process.env.MNEMONIC!,
            }
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            chainId: 1,
            accounts: {
                mnemonic: process.env.MNEMONIC!,
            }
        },
    },
    solc: {
        version: '0.6.11',
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
};

export default config;
