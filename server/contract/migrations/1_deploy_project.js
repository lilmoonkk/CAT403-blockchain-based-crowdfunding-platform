const project = artifacts.require("project");

module.exports = function(deployer, network, accounts) {
    const companyAddress = accounts[0];
    deployer.deploy(project, 1, 1, companyAddress);
}