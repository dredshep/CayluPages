import styled from "styled-components";

export const MapWrapper = styled.div<{ refresh?: "true" | "false" }>`
  position: relative;
  width: 100%;
  height: 100%;

  .ol-control {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    padding: 2px;
  }

  .ol-control button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.5em;
    width: 1.5em;
    background-color: rgba(0, 60, 136, 0.5);
    color: white;
    border: none;
    border-radius: 2px;
    margin: 1px;
    font-size: 1.14em;
  }

  .ol-zoom {
    top: 0.5em;
    left: 0.5em;
  }

  .ol-rotate {
    top: 0.5em;
    right: 0.5em;
  }

  .ol-attribution {
    right: 0.5em;
    bottom: 0.5em;
    max-width: calc(100% - 1.3em);
  }

  .ol-attribution ul {
    font-size: 0.7rem;
    line-height: 1.375em;
    color: #000;
    text-shadow: 0 0 2px #fff;
    max-width: calc(100% - 3.6em);
  }

  .ol-attribution button {
    float: right;
  }

  ${(props) =>
    props.refresh &&
    `
    // This will force a re-calculation of styles
    transform: translateZ(0);
  `}
`;
