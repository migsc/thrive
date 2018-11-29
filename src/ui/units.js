import { h, render, Component } from "preact";
/** @jsx h */

import game from "../game";

export default class UIUnits extends Component {
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
      <section style={style} id="units">
        <div id="collection" class="container is-dark">
          <p>...</p>
        </div>
        <div id="individual" class="container is-dark">
          <p>...</p>
          {selectedUnit && <p>Moving points: {selectedUnit.movingPoints} </p>}
        </div>
        <div id="actions" class="container is-dark with-title">
          <label class="title">Actions</label>
        </div>
      </section>
    );
  }
}
