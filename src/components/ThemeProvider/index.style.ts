import { css } from '@emotion/css'

export const cssLayout = css`
  .menu-body {
    display: flex;

    > :nth-child(n) {
      width: max-content;
    }
  }
`
