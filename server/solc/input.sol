// SPDX-License-Identifier: ISC
pragma solidity ^0.8.1;

contract Topic {
    struct Message {
        mapping (address => bool) acks;
        string payload;
        address sender;
        bool visible;
    }

    constructor() {
        //->INJECT

        current = 0;
        if (!isPublisher[owner]) {
            addPublisher(owner);
        }
    }

    address private owner;

    address[] private publishers;
    mapping(address => bool) private isPublisher;

    address[] private listeners;
    mapping(address => bool) private isListener;

    uint private current;
    mapping (uint => Message) private messages;

    function addPublisher(address _addr) private {
        isPublisher[_addr] = true;
        publishers.push(_addr);
    }

    function addListener(address _addr) private {
        isListener[_addr] = true;
        listeners.push(_addr);
    }

    event Publish(uint id);

    function publish(address sender, string calldata _payload) public {
        require(isPublisher[sender], "wtf?");

        uint id = current;
        current = current + 1;

        Message storage currentMessage = messages[id];

        currentMessage.sender = sender;
        currentMessage.payload = _payload;
        currentMessage.visible = false;

        emit Publish(id);
    }

    event Visible(uint id);

    function ack(address sender, uint _id) public {
        require(isListener[sender]);
        Message storage currentMessage = messages[_id];
        currentMessage.acks[sender] = true;

        bool visible = true;

        for (uint i = 0; i < listeners.length && visible; i++) {
            if (!currentMessage.acks[listeners[i]]) {
                visible = false;
            }
        }

        if (visible) {
            currentMessage.visible = true;
            emit Visible(_id);
        }
    }

    function getMessage(
        address sender, uint _id
    ) view public returns (string memory payload) {
        require(isListener[sender]);

        Message storage currentMessage = messages[_id];

        require(currentMessage.visible);

        return currentMessage.payload;
    }
}
