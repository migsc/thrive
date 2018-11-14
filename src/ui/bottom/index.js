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
      shouldShowMoveable: true
    };

    console.log("gammmme?", game);
  }

  componentDidMount() {
    game.events.on("ontilemoved", this.handleTileMoved.bind(this));
  }

  handleTileMoved(ev) {
    console.log("handleTileMoved", ev);
    this.setState({
      activeTile: ev.tile.tileXY
    });
  }

  onShowMoveable(ev) {
    game.events.emit("onshowmoveable");
    this.setState({
      shouldShowMoveable: true
    });
  }

  onHideMoveable(ev) {
    game.events.emit("onhidemoveable");
    this.setState({
      shouldShowMoveable: false
    });
  }

  render() {
    let { activeTile, shouldShowMoveable } = this.state;
    return (
      <div id="bottom">
        <h2>
          Active tile - x:{activeTile.x}, y:{activeTile.y}
        </h2>
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
