// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract project{
    enum State {completed, approved, notCompleted, notApproved}
    State state;
    string proofId;
    string projectId;
    address payable company;
    uint fundAmount;
    struct milestone{
        uint seq;
        uint amount;
    }
    //address payable backer;
    mapping(uint => milestone) milestones;
    constructor (string memory _projectId, milestone[] memory _milestone, address payable _company) payable{
        fundAmount = msg.value;
        projectId = _projectId;
        for (uint i = 1; i <= _milestone.length; i++) {
            milestones[i] = _milestone[i-1];
        }
        company = _company;
        //backer = _backer;
    }

    function uploadProof(string memory _proofId) public{
        proofId = _proofId;
        state = State.completed;
    }

    function verifyProof(bool isApproved) public{
        if(isApproved){ 
            state = State.approved;
            releaseFund();
        } else {
            state = State.notApproved;
            //returnFund();
        }
    }

    function releaseFund() public payable{
        require(state == State.approved,"Proof is not approved");
        company.transfer(fundAmount);
    }

    function returnFund(address payable backer) public payable{
        require(state == State.notApproved,"It does not meet the requirement to return fund");
        backer.transfer(fundAmount);
    }
}
