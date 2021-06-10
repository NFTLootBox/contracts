// Sources flattened with hardhat v2.0.5 https://hardhat.org

// File @openzeppelin/contracts/introspection/IERC165.sol@v3.3.0

// SPDX-License-Identifier: MIT

//import "./lib/IERC1155.sol";
import "./lib/ReentrancyGuard.sol";
import "./lib/Context.sol";
import "./lib/Ownable.sol";
import "./NFT.sol";
pragma solidity 0.7.3;

contract NFTLootboxNFT is ERC1155, Ownable, ReentrancyGuard {
    constructor() ERC1155("https://app.nftlootbox.com/api/card/{id}") {}

    mapping(address => bool) public isMinter;

    function setMinter(address minter, bool status) public nonReentrant onlyOwner {
        isMinter[minter] = status;
    }

    function mint(address to, uint256 id, uint256 amount) public nonReentrant {
      require(isMinter[_msgSender()] == true, "Caller is not a minter");
      _mint(to, id, amount, "");
    }
    function burn(uint256 id, uint256 amount) public nonReentrant {
        _burn(_msgSender(), id, amount); 
    }

    function burnBatch(uint256[] memory ids, uint256[] memory amounts) public nonReentrant {
        _burnBatch(_msgSender(), ids, amounts);
    }
}
