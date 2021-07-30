// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ColorNFT is ERC721, ERC721Enumerable {
  string[] public colors;
  mapping(string => bool) _colorExists;

  constructor() 
    ERC721("Color", "COLOR") 
    {
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function safeMint(string memory _color) public {
    require(!_colorExists[_color], 'The color should be unique');
    colors.push(_color);
    uint _id = colors.length;
    _safeMint(msg.sender, _id);
    _colorExists[_color] = true;
  }
}