// SPDX-License-Identifier: Apache-2.0
// Copyright 2021 Aztec

pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

library AztecTypes {
    enum AztecAssetType {
        NOT_USED,
        ETH,
        ERC20,
        VIRTUAL
    }

    struct AztecAsset {
        uint256 id;
        address erc20Address;
        AztecAssetType assetType;
    }
}