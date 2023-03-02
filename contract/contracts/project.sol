// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract project{
    enum State {completed, approved, notCompleted, notApproved}
    State state;
    string proofId;
    uint projectId;
    uint milestoneId;
    address payable company;
    uint fundAmount;
    //address payable backer;

    constructor (uint _projectId, uint _milestoneId, address payable _company) payable{
        fundAmount = msg.value;
        projectId = _projectId;
        milestoneId = _milestoneId;
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
