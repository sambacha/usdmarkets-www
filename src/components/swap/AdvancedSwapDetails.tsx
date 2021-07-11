import { Trade } from '@uniswap/sdk';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import { TYPE, ExternalLink } from '../../theme';
import { computeTradePriceBreakdown } from '../../utils/prices';
import { AutoColumn } from '../Column';
import QuestionHelper from '../QuestionHelper';
import { RowBetween, RowFixed } from '../Row';
import SwapRoute from './SwapRoute';

const InfoLink = styled(ExternalLink)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 6px 6px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
`;

function TradeSummary({
  trade,
  allowedSlippage,
}: {
  trade: Trade;
  allowedSlippage: number;
}) {
  const theme = useContext(ThemeContext);
  const { realizedLPFee } = computeTradePriceBreakdown(trade);

  return (
    <>
      <AutoColumn style={{ padding: '0 16px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme.text1}>
            {realizedLPFee
              ? `${realizedLPFee.toSignificant(4)} ${
                  trade.inputAmount.currency.symbol
                }`
              : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  );
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext);

  const [allowedSlippage] = useUserSlippageTolerance();

  const showRoute = Boolean(trade && trade.route.path.length > 2);

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '0 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <TYPE.black
                    fontSize={14}
                    fontWeight={400}
                    color={theme.text2}
                  >
                    Route
                  </TYPE.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
          {!showRoute && (
            <AutoColumn style={{ padding: '12px 16px 0 16px' }}>
              <InfoLink
                href={
                  'https://uniswap.info/pair/' +
                  trade.route.pairs[0].liquidityToken.address
                }
                target="_blank"
              >
                View pair analytics ↗
              </InfoLink>
            </AutoColumn>
          )}
        </>
      )}
    </AutoColumn>
  );
}
