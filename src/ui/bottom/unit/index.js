import { h, render, Component } from "preact";
/** @jsx h */

import "./styles.scss";
import game from "../../../game";

export default class UIUnit extends Component {
  constructor() {
    super();
    this.state = {
      selectedUnit: null
    };
  }

  // This isn't being served yet

  render() {
    let { selectedUnit } = this.state;
    return (
      <div id="unit">
        {selectedUnit && <h2>Moving points: {selectedUnit.movingPoints} </h2>}
      </div>
    );
  }
}
