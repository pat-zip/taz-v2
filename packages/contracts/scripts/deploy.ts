import fs from "fs";
import path from "path";
import { deployUnirep } from "@unirep/contracts/deploy/index.js";
import hardhat from "hardhat";
const { ethers } = hardhat;

// const UnirepApp = require("../artifacts/contracts/UnirepApp.sol/UnirepApp.json");
// const UNIREP_ARBITRUM_GOERLI = "0x5e50ba700443FfA87d3A02039234dAA4F3c59A36";

async function deploy() {
  const [signer] = await ethers.getSigners();
  const unirep = await deployUnirep(signer);
  const epochLength = 100;

  const Verifier = await ethers.getContractFactory("ProveRepRegisterVerifier");
  const verifier = await Verifier.deploy();
  await verifier.deployed();

  const App = await ethers.getContractFactory("UnirepApp");
  const app = await App.deploy(unirep.address, verifier.address, epochLength);

  await app.deployed();

  console.log(`Unirep app with epoch length ${epochLength} deployed to ${app.address}`);

  const config = `module.exports = {
      UNIREP_ADDRESS: '${unirep.address}',
      APP_ADDRESS: '${app.address}',
      ETH_PROVIDER_URL: '${hardhat.network.config.url ?? ""}',
      SERVER: 'http://127.0.0.1:3000',
      ${
        Array.isArray(hardhat.network.config.accounts)
          ? `PRIVATE_KEY: '${hardhat.network.config.accounts[0]}'`
          : `/**
        This contract was deployed using a mnemonic. The PRIVATE_KEY variable needs to be set manually
      **/`
      },
      IDENTITY: {
        identityNullifier: "1f9ed88f6ae8bbc3d0074f6973d048834fb37faa5d8fb64d2d65a03e03640822",
        identityTrapdoor: "18116473d16f162dfb56a3f1111b2799c3acbf781f82ee81268b8987c305373a",
        secret: [
          "1f9ed88f6ae8bbc3d0074f6973d048834fb37faa5d8fb64d2d65a03e03640822",
          "18116473d16f162dfb56a3f1111b2799c3acbf781f82ee81268b8987c305373a",
        ],
      },
    }
    `;
  const configPath = path.join(__dirname, "../../../config.js");
  await fs.promises.writeFile(configPath, config);
  console.log(`Config written to ${configPath}`);
}

deploy();
