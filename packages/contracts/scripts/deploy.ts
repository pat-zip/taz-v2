import fs from "fs";
import path from "path";
import { deployUnirep } from "@unirep/contracts/deploy/index.js";
import hardhat from "hardhat";
const { ethers } = hardhat;

// const UnirepApp = require("../abi/UnirepApp.json")

async function deploy() {
    const [signer] = await ethers.getSigners();
    const unirep = await deployUnirep(signer);
    const epochLength = 100;

    const App = await ethers.getContractFactory("UnirepApp");
    const app = await App.deploy(unirep.address, epochLength);

    await app.deployed();

    console.log(`Unirep app with epoch length ${epochLength} deployed to ${app.address}`);

    const config = `module.exports = {
      UNIREP_ADDRESS: '${unirep.address}',
      APP_ADDRESS: '${app.address}',
      ETH_PROVIDER_URL: '${hardhat.network.config.url ?? ""}',
      SERVER: 'http://127.0.0.1:3000',
      ${
          Array.isArray(hardhat.network.config.accounts)
              ? `PRIVATE_KEY: '${hardhat.network.config.accounts[0]}',`
              : `/**
        This contract was deployed using a mnemonic. The PRIVATE_KEY variable needs to be set manually
      **/`
      }
    }
    `;
    const configPath = path.join(__dirname, "../../../config.js");
    await fs.promises.writeFile(configPath, config);
    console.log(`Config written to ${configPath}`);
}

deploy();
