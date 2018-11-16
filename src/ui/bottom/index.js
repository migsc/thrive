import { h, render, Component } from "preact";
/** @jsx h */

import "./styles.scss";
import game from "../../game";

export default class UIBottom extends Component {
  constructor() {
    super();
    this.state = {
      activeTile: {
        x: "?",
        y: "?"
      },
      turn: "?",
      shouldShowMoveable: true
    };
  }

  componentDidMount() {
    game.events.on("tile.moved", this.handleTileMoved.bind(this));
    game.events.on("game.roundstart", this.roundStarted.bind(this));
  }

  handleTileMoved(e) {
    console.log("handleTileMoved", e);
    this.setState({
      activeTile: e.tile.tileXY
    });
  }

  roundStarted(e) {
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

  render() {
    let { activeTile, currentRound, shouldShowMoveable } = this.state;
    return (
      <div id="bottom">
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
    );
  }
}
