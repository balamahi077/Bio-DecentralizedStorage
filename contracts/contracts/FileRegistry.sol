// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FileRegistry {
    struct FileRecord {
        string cid;
        string name;
        uint256 timestamp;
    }

    mapping(address => FileRecord[]) private ownerToFiles;

    event FileAdded(address indexed owner, string cid, string name, uint256 timestamp);

    function addFile(string calldata cid, string calldata name) external {
        require(bytes(cid).length > 0, "CID required");
        FileRecord memory rec = FileRecord({ cid: cid, name: name, timestamp: block.timestamp });
        ownerToFiles[msg.sender].push(rec);
        emit FileAdded(msg.sender, cid, name, rec.timestamp);
    }

    function getMyFiles() external view returns (FileRecord[] memory) {
        return ownerToFiles[msg.sender];
    }
}
