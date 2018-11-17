import { h, render, Component } from "preact";
/** @jsx h */

import "./styles.scss";
import game from "../../game";

import UIUnit from "./unit";

export default class UIBottom extends Component {
  constructor() {
    super();
    this.state = {
      activeTile: {
        x: "?",
        y: "?"
      },
      turn: "?",
      shouldShowMoveable: true,
      selectedUnit: null
    };
  }

  componentDidMount() {
    game.events.on("tile.moved", this.handleTileMoved.bind(this));
    game.events.on("game.roundstart", this.onRoundStarted.bind(this));
    game.events.on("game.selectunit", this.onUnitSelected.bind(this));
  }

  handleTileMoved(e) {
    console.log("handleTileMoved", e);
    this.setState({
      activeTile: e.tile.tileXY
    });
  }

  onRoundStarted(e) {
    this.setState({
      currentRound: e.round
    });
  }

  onShowMoveable() {
    game.events.emit("ui.showmoveable");
    this.setState({
      shouldShowMoveable: true
    });
  }

  onHideMoveable() {
    game.events.emit("ui.hidemoveable");
    this.setState({
      shouldShowMoveable: false
    });
  }

  onUnitSelected(e) {
    let { unit } = e;
    console.log(unit);
    this.setState({
      selectedUnit: unit
    });
  }

  render() {
    let {
      activeTile,
      currentRound,
      shouldShowMoveable,
      selectedUnit
    } = this.state;
    return (
      <div id="bottom">
        <div id="debug">
          <h2>
            Active tile - x:{activeTile.x}, y:{activeTile.y}
          </h2>
          <h2>Round: {currentRound}</h2>
          <h2>
            {shouldShowMoveable ? (
              <button
                onClick={this.onHideMoveable.bind(this)}
                id="#down"
                type="button"
                class="btn btn-outline-warning"
              >
                Hide moveable area
                <i class="fas fa-stroopwafel" />
              </button>
            ) : (
              <button
                onClick={this.onShowMoveable.bind(this)}
                id="#down"
                type="button"
                class="btn btn-outline-warning"
              >
                Show moveable area
                <i class="fas fa-stroopwafel" />
              </button>
            )}
          </h2>
        </div>
        {selectedUnit && <UIUnit unit={selectedUnit} />}
      </div>
    );
  }
}
