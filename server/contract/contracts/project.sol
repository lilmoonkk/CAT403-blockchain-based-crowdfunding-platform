// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract project{
    event Pledge(address indexed caller, uint amount);
    event Unpledge(address indexed target, uint amount);
    event Transfer(address indexed target, uint amount);
    event Claim();
    enum State {completed, approved, notCompleted, notApproved}
    //State state;
    string projectId;
    address payable company;
    uint goal;
    uint pledged;
    /*struct proof{
        string id;
        string signature;
    }*/
    string imagehash;
    //Ori
    /*struct milestone{
        uint seq;
        uint amount;
    }*/
    //mapping(uint => milestone) milestones;
    struct milestone{
        uint amount;
        State state;
        string response;
    }
    mapping(uint => milestone) milestones;
    mapping(uint => string) public proofs;

    //Ori
    /*constructor (string memory _projectId, milestone[] memory _milestone, address payable _company) payable{
        //fundAmount = msg.value;
        projectId = _projectId;
        for (uint i = 1; i <= _milestone.length; i++) {
            milestones[i] = _milestone[i-1];
        }
        company = _company;
        //backer = _backer;
    }*/

    constructor (string memory _projectId, uint[] memory _milestone, address payable _company) payable{
        //fundAmount = msg.value;
        projectId = _projectId;
        for (uint i = 1; i <= _milestone.length; i++) {
            milestones[i] = milestone(_milestone[i-1], State.notCompleted, "");
        }
        company = _company;
        //backer = _backer;
    }

    function pledge(uint _amount) external payable {
        //pledgedAmount[_id][msg.sender] += _amount;
        // transfer fund to smart contract
        pledged += _amount;
        emit Pledge(msg.sender, msg.value);
    }

    function unpledge(address payable backer, uint _amount) external {

        pledged -= _amount;
        backer.transfer(_amount);

        emit Unpledge(backer, _amount);
    }

    function transferFund(address payable backer, uint _amount) external {
        require(address(this).balance >= _amount);
        pledged -= _amount;
        backer.transfer(_amount);

        emit Transfer(backer, _amount);
    }

    function getPledged() public view returns (uint){
        return pledged;
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function getProof(uint seq) public view returns (string memory){
        return proofs[seq];
    }

    function compareProof(string memory _proof, uint seq) public view returns (bool){
        return keccak256(abi.encodePacked(proofs[seq])) == keccak256(abi.encodePacked(_proof));
    }

    function getResponse(uint seq) public view returns (string memory){
        return milestones[seq].response;
    }

    function claim(uint milestoneseq) external {
        company.transfer(milestones[milestoneseq].amount);

        emit Claim();
    }

    /*function uploadProof(string memory _proofId) public{
        proofId = _proofId;
        state = State.completed;
    }*/

    function uploadProof(uint milestoneseq, string memory _proof) public{
        /*for (uint i = 1; i <= _proof.length; i++) {
            proofs[milestoneseq].push(_proof[i-1]);
        }*/
        proofs[milestoneseq] = _proof;
        milestones[milestoneseq].state = State.completed;
    }

    function uploadApproval(uint milestoneseq, string memory _response, bool approved) public{
        /*for (uint i = 1; i <= _proof.length; i++) {
            proofs[milestoneseq].push(_proof[i-1]);
        }*/
        milestones[milestoneseq].response = _response;
        if(approved){
            milestones[milestoneseq].state = State.approved;
        } else {
            milestones[milestoneseq].state = State.notApproved;
        }
    }

    /*function verifyProof(bool isApproved) public{
        if(isApproved){ 
            state = State.approved;
            releaseFund();
        } else {
            state = State.notApproved;
            //returnFund();
        }
    }*/

    /*function releaseFund() public payable{
        require(state == State.approved,"Proof is not approved");
        company.transfer(balance);
    }

    function returnFund(address payable backer) public payable{
        require(state == State.notApproved,"It does not meet the requirement to return fund");
        backer.transfer(balance);
    }*/
}