import { h, render, Component } from "preact";
/** @jsx h */

import game from "../game";

export default class UIUnit extends Component {
  constructor() {
    super();
    this.state = {
      selectedUnit: null
    };
  }

  componentDidMount() {
    game.events.on("game.selectunit", this.onUnitSelected.bind(this));
  }

  onUnitSelected(e) {
    let { unit } = e;
    console.log(unit);
    this.setState({
      selectedUnit: unit
    });
  }

  render() {
    let { selectedUnit } = this.state;
    let { style } = this.props;

    return (
      <section style={style} id="unit">
        {selectedUnit && <h2>Moving points: {selectedUnit.movingPoints} </h2>}
      </section>
    );
  }
}
