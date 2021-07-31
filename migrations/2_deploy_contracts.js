const ColorNFT = artifacts.require("ColorNFT");

module.exports = async function (deployer) {
  await deployer.deploy(ColorNFT);
};