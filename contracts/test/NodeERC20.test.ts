import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { NodeERC20 } from "../typechain-types";

describe("ERC20 Token Contract", function () {
  let nodeERC20: NodeERC20;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let MINTER_ROLE: string;
  let PAUSER_ROLE: string;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();
    const NodeERC20Factory = await ethers.getContractFactory("NodeERC20");

    // at the time of deployment, the default admin, the pauser, and the minter is the deployer
    nodeERC20 = await NodeERC20Factory.deploy(
      ownerAddress,
      ownerAddress,
      ownerAddress
    );

    // get the roles
    MINTER_ROLE = await nodeERC20.MINTER_ROLE();
    PAUSER_ROLE = await nodeERC20.PAUSER_ROLE();
  });

  describe("Mintable ERC20", function () {
    it("Should be possible for a minter to mint tokens", async function () {
      await nodeERC20.mint(owner.address, 100);
      expect(await nodeERC20.balanceOf(owner.address)).to.equal(100);
    });

    it("Should not be possible for non-minters to mint tokens", async function () {
      await expect(
        nodeERC20.connect(addr1).mint(owner.address, 100)
      ).to.be.revertedWithCustomError(
        nodeERC20,
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("Burnable ERC20", function () {
    it("Should be possible for a holder to burn tokens", async function () {
      await nodeERC20.mint(owner.address, 100);
      await nodeERC20.burn(100);
      expect(await nodeERC20.balanceOf(owner.address)).to.equal(0);
    });

    it("Should not be possible for non-holders to burn tokens", async function () {
      await expect(
        nodeERC20.connect(addr1).burn(100)
      ).to.be.revertedWithCustomError(nodeERC20, "ERC20InsufficientBalance");
    });
  });

  describe("Pausable ERC20", function () {
    it("Should be possible for a pauser to pause the contract", async function () {
      await nodeERC20.pause();
      expect(await nodeERC20.paused()).to.be.true;
    });

    it("Should not be possible for non-pausers to pause the contract", async function () {
      await expect(
        nodeERC20.connect(addr1).pause()
      ).to.be.revertedWithCustomError(
        nodeERC20,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("Should be possible for a pauser to unpause the contract", async function () {
      await nodeERC20.pause();
      await nodeERC20.unpause();
      expect(await nodeERC20.paused()).to.be.false;
    });

    it("Should not be possible for non-pausers to unpause the contract", async function () {
      await expect(
        nodeERC20.connect(addr1).unpause()
      ).to.be.revertedWithCustomError(
        nodeERC20,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("Should not be possible to burn tokens when the contract is paused", async function () {
      await nodeERC20.mint(owner.address, 100);
      await nodeERC20.pause();
      await expect(nodeERC20.burn(100)).to.be.revertedWithCustomError(
        nodeERC20,
        "EnforcedPause"
      );
    });

    it("Should not be possible to mint tokens when the contract is paused", async function () {
      await nodeERC20.pause();
      await expect(
        nodeERC20.mint(owner.address, 100)
      ).to.be.revertedWithCustomError(nodeERC20, "EnforcedPause");
    });

    it("Should not be possible to transfer tokens when the contract is paused", async function () {
      await nodeERC20.mint(owner.address, 100);
      await nodeERC20.pause();
      await expect(
        nodeERC20.connect(addr1).transfer(addr2.address, 100)
      ).to.be.revertedWithCustomError(nodeERC20, "EnforcedPause");
    });
  });

  describe("Transferable ERC20", function () {
    it("Should be possible for a holder to transfer tokens", async function () {
      await nodeERC20.mint(owner.address, 100);
      await nodeERC20.transfer(addr1.address, 100);
      expect(await nodeERC20.balanceOf(owner.address)).to.equal(0);
      expect(await nodeERC20.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should not be possible for a holder to transfer more tokens than they have", async function () {
      await nodeERC20.mint(owner.address, 100);
      await expect(
        nodeERC20.transfer(addr1.address, 101)
      ).to.be.revertedWithCustomError(nodeERC20, "ERC20InsufficientBalance");
    });

    it("Should not be possible for a non-holder to transfer tokens", async function () {
      await expect(
        nodeERC20.connect(addr1).transfer(addr2.address, 100)
      ).to.be.revertedWithCustomError(nodeERC20, "ERC20InsufficientBalance");
    });
  });

  describe("Mintable Access Control", function () {
    it("Should be possible for the admin to add a minter", async function () {
      await nodeERC20.grantRole(MINTER_ROLE, addr1.address);
      expect(await nodeERC20.hasRole(MINTER_ROLE, addr1.address)).to.be.true;
    });

    it("Should not be possible for non-admins to add a minter", async function () {
      await expect(
        nodeERC20.connect(addr1).grantRole(MINTER_ROLE, addr2.address)
      ).to.be.revertedWithCustomError(
        nodeERC20,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("Should be possible for the added minter to mint tokens", async function () {
      await nodeERC20.grantRole(MINTER_ROLE, addr1.address);
      await nodeERC20.connect(addr1).mint(owner.address, 100);
      expect(await nodeERC20.balanceOf(owner.address)).to.equal(100);
    });

    it("Should not be possible for minters to add minters", async function () {
      await nodeERC20.grantRole(MINTER_ROLE, addr1.address);
      await expect(
        nodeERC20.connect(addr1).grantRole(MINTER_ROLE, addr2.address)
      ).to.be.revertedWithCustomError(
        nodeERC20,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("Should be possible for the admin to remove a minter", async function () {
      await nodeERC20.grantRole(MINTER_ROLE, addr1.address);
      await nodeERC20.revokeRole(MINTER_ROLE, addr1.address);
      expect(await nodeERC20.hasRole(MINTER_ROLE, addr1.address)).to.be.false;
    });

    it("Should not be possible for non-admins to remove a minter", async function () {
      await nodeERC20.grantRole(MINTER_ROLE, addr1.address);
      await expect(
        nodeERC20.connect(addr1).revokeRole(MINTER_ROLE, addr1.address)
      ).to.be.revertedWithCustomError(
        nodeERC20,
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("Pausable Access Control", function () {
    it("Should be possible for the admin to add a pauser", async function () {
      await nodeERC20.grantRole(PAUSER_ROLE, addr1.address);
      expect(await nodeERC20.hasRole(PAUSER_ROLE, addr1.address)).to.be.true;
    });

    it("Should not be possible for non-admins to add a pauser", async function () {
      await expect(
        nodeERC20.connect(addr1).grantRole(PAUSER_ROLE, addr2.address)
      ).to.be.revertedWithCustomError(
        nodeERC20,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("Should be possible for the added pauser to pause the contract", async function () {
      await nodeERC20.grantRole(PAUSER_ROLE, addr1.address);
      await nodeERC20.connect(addr1).pause();
      expect(await nodeERC20.paused()).to.be.true;
    });

    it("Should not be possible for pausers to add pausers", async function () {
      await nodeERC20.grantRole(PAUSER_ROLE, addr1.address);
      await expect(
        nodeERC20.connect(addr1).grantRole(PAUSER_ROLE, addr2.address)
      ).to.be.revertedWithCustomError(
        nodeERC20,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("Should be possible for the admin to remove a pauser", async function () {
      await nodeERC20.grantRole(PAUSER_ROLE, addr1.address);
      await nodeERC20.revokeRole(PAUSER_ROLE, addr1.address);
      expect(await nodeERC20.hasRole(PAUSER_ROLE, addr1.address)).to.be.false;
    });

    it("Should not be possible for non-admins to remove a pauser", async function () {
      await nodeERC20.grantRole(PAUSER_ROLE, addr1.address);
      await expect(
        nodeERC20.connect(addr1).revokeRole(PAUSER_ROLE, addr1.address)
      ).to.be.revertedWithCustomError(
        nodeERC20,
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("Get Token Details", function () {
    it("Should return the correct token name", async function () {
      const [name] = await nodeERC20.getTokenDetails();
      expect(name).to.equal("Node");
    });

    it("Should return the correct token symbol", async function () {
      const [, symbol] = await nodeERC20.getTokenDetails();
      expect(symbol).to.equal("NODE");
    });

    it("Should return the correct token decimals", async function () {
      const [, , decimals] = await nodeERC20.getTokenDetails();
      expect(decimals).to.equal(18);
    });

    it("Should return the correct token total supply", async function () {
      const [, , , totalSupply] = await nodeERC20.getTokenDetails();
      expect(totalSupply).to.equal(0);
    });

    it("Should return the correct token paused status", async function () {
      const [, , , , paused] = await nodeERC20.getTokenDetails();
      expect(paused).to.be.false;
    });

    it("Should return the correct amount of total supply after minting", async function () {
      await nodeERC20.mint(owner.address, 100);
      const [, , , totalSupply] = await nodeERC20.getTokenDetails();
      expect(totalSupply).to.equal(100);
    });
  });
});
