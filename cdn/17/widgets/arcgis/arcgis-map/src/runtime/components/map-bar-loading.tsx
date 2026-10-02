import type { CSSProperties } from 'react'
import { React, css } from 'jimu-core'

export interface MapBarLoadingProps {
  /** Animation speed multiplier. Defaults to 1. */
  speed?: number;
  /** Track height in pixels. Defaults to 1. */
  trackHeight?: number;
  /** Fill height in pixels. Defaults to 1. */
  fillHeight?: number;
  /** Track color. */
  trackColor?: string;
  /** Fill color. */
  fillColor?: string;
  className?: string;
  style?: CSSProperties;
}

const cssStyle = css`
position: absolute;
top: 0;
left: 0;
width: 100%;
height: var(--bar-track-h, 2px);
background: var(--bar-track-color);
overflow: hidden;
display: flex;
align-items: flex-start;
--speed: 1;

.map-bar-loading__fill {
  height: var(--bar-fill-h, 2px);
  width: 58%;
  background: var(--bar-fill-color);
  animation: map-bar-loading-sweep calc(2.4s / var(--speed)) ease-in-out infinite;
}

@keyframes map-bar-loading-sweep {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(320%); }
}
`

export function MapBarLoading ({
  speed = 1,
  trackHeight = 1,
  fillHeight = 1,
  trackColor = 'rgba(0, 0, 0, 0.2)',
  fillColor = 'rgba(255, 255, 255, 0.8)',
  className,
  style,
}: MapBarLoadingProps) {
  return (
    <div
      className={['map-bar-loading', className].filter(Boolean).join(' ')}
      css={cssStyle}
      style={
        {
          '--speed': speed,
          '--bar-track-h': `${trackHeight}px`,
          '--bar-fill-h': `${fillHeight}px`,
          '--bar-track-color': trackColor,
          '--bar-fill-color': fillColor,
          ...style,
        } as CSSProperties
      }
      role='status'
    >
      <div className='map-bar-loading__fill' />
    </div>
  )
}

export default MapBarLoading
