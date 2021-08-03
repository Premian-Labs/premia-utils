import { hexConcat, hexDataSlice, hexZeroPad } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { BytesLike } from '@ethersproject/bytes';

export enum TokenType {
  UnderlyingFreeLiq = 0,
  BaseFreeLiq = 1,
  UnderlyingReservedLiq = 2,
  BaseReservedLiq = 3,
  LongCall = 4,
  ShortCall = 5,
  LongPut = 6,
  ShortPut = 7,
}

export interface TokenIdParams {
  tokenType: TokenType;
  maturity: BigNumber;
  strike64x64: BigNumber;
}

export function formatTokenId({
  tokenType,
  maturity,
  strike64x64,
}: TokenIdParams) {
  return hexConcat([
    hexZeroPad(BigNumber.from(tokenType).toHexString(), 1),
    hexZeroPad('0x0', 7),
    hexZeroPad(maturity.toHexString(), 8),
    hexZeroPad(strike64x64.toHexString(), 16),
  ]);
}

export function getOptionTokenIds(
  maturity: BigNumber,
  strike64x64: BigNumber,
  isCall: boolean,
) {
  return {
    short: formatTokenId({
      tokenType: isCall ? TokenType.ShortCall : TokenType.ShortPut,
      maturity,
      strike64x64,
    }),
    long: formatTokenId({
      tokenType: isCall ? TokenType.LongCall : TokenType.LongPut,
      maturity,
      strike64x64,
    }),
  };
}

export function parseTokenId(tokenId: BytesLike): TokenIdParams {
  return {
    tokenType: Number(hexDataSlice(tokenId, 0, 1)),
    maturity: BigNumber.from(hexDataSlice(tokenId, 8, 16)),
    strike64x64: BigNumber.from(hexDataSlice(tokenId, 16, 32)),
  };
}
