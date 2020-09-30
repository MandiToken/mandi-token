import { ethers } from "@nomiclabs/buidler";
import { deployContract } from "ethereum-waffle";
import { utils, Contract, Signer } from "ethers";
const { expect } = require("chai");
import { TOTAL_SUPPLY, holders, balances } from "../scripts/prodConfig";

import MandiToken from "../artifacts/MandiToken.json";

describe("Token properties", () => {
  let signers: Signer[];
  let signer: Signer;
  let mandi: Contract;

  before(async () => {
    signers = await ethers.getSigners();
    signer = signers[0];
  });

  describe("Deploy scenarios", () => {
    it("Should deploy entire supply to single holder correctly", async () => {
      const deployer = signers[0];
      const initialHolder = signers[1];

      mandi = await deployContract(deployer, MandiToken, [
        [await initialHolder.getAddress()],
        [TOTAL_SUPPLY],
      ]);

      expect(
        await mandi.balanceOf(await initialHolder.getAddress()),
        "balanceOf"
      ).to.be.equal(TOTAL_SUPPLY);
    });

    it("Should deploy to multiple holders correctly", async () => {
      mandi = await deployContract(signer, MandiToken, [holders, balances]);
      expect(await mandi.balanceOf(holders[0]), "balanceOf").to.be.equal(
        balances[0]
      );
      expect(await mandi.balanceOf(holders[1]), "balanceOf").to.be.equal(
        balances[1]
      );
    });

    it("Should fail with incorrect initial supply totals", async () => {
      await expect(
        deployContract(signer, MandiToken, [
          holders,
          [utils.parseEther("1"), utils.parseEther("500000")],
        ])
      ).to.be.revertedWith(
        "MandiToken: Initial supply does not match expected"
      );
    });

    it("Should fail with mismatched array size", async () => {
      await expect(
        deployContract(signer, MandiToken, [holders, [TOTAL_SUPPLY]])
      ).to.be.revertedWith("MandiToken: Constructor array size mismatch");
    });
  });

  describe("Standard tests", () => {
    beforeEach(async () => {
      const holder1 = await signers[0].getAddress();
      const holder2 = await signers[1].getAddress();

      mandi = await deployContract(signers[0], MandiToken, [
        [holder1, holder2],
        balances,
      ]);
    });

    it("Should have 10,000,000,000 tokens on creation (interpret with 8 decimals of precision", async () => {
      const totalSupply = await mandi.totalSupply();
      expect(totalSupply, "totalSupply").to.be.equal(TOTAL_SUPPLY);
    });

    it("Should have correct name, symbol and decimals (Mandi, Mandi, 18)", async () => {
      const name = await mandi.name();
      const symbol = await mandi.symbol();
      const decimals = await mandi.decimals();

      expect(name, "name").to.be.equal("Mandi");
      expect(symbol, "symbol").to.be.equal("Mandi");
      expect(decimals, "decimals").to.be.equal(18);
    });

    it("Should be transferrable as expected", async () => {
      const sender = await signers[0].getAddress();
      const recipient1 = await signers[3].getAddress();
      const recipient2 = await signers[4].getAddress();

      const amount1 = utils.parseEther("1000");
      const amount2 = utils.parseEther("500");

      await (
        await mandi.connect(signers[0]).transfer(recipient1, amount1)
      ).wait();
      await (
        await mandi.connect(signers[0]).transfer(recipient2, amount2)
      ).wait();

      const user1Balance = await mandi.balanceOf(recipient1);
      const user2Balance = await mandi.balanceOf(recipient2);

      expect(user1Balance, "user1Balance").to.be.equal(amount1);
      expect(user2Balance, "user2Balance").to.be.equal(amount2);
    });
  });
});
