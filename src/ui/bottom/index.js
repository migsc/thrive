import { h, render, Component } from "preact";
/** @jsx h */

import "./styles.scss";
import game from "../../game";

import UIUnit from "./unit";
import UIMap from "./map";

const tab = {
  MAP: "map",
  UNITS: "units"
};

export default class UIBottom extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: tab.MAP,
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
    game.events.on("game.roundstart", this.onRoundStarted.bind(this));
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

  isActiveTab(tab) {
    let { activeTab } = this.state;
    return tab === activeTab;
  }

  setActiveTab(tab) {
    this.setState({
      activeTab: tab
    });
  }

  getBottomHeight() {
    if (this.bottomRef) return this.bottomRef.clientHeight;
    return 0;
  }

  render() {
    let { activeTab } = this.state;
    return (
      <div ref={ref => (this.bottomRef = ref)} id="bottom">
        <nav class="nav">
          <a
            class={`nav-link ${this.isActiveTab(tab.MAP) ? "active" : ""}`}
            href="#"
            onClick={() => this.setActiveTab(tab.MAP)}
          >
            <i class="fas fa-circle" /> Map
          </a>
          <a
            class={`nav-link ${this.isActiveTab(tab.UNITS) ? "active" : ""}`}
            href="#"
            onClick={() => this.setActiveTab(tab.UNITS)}
          >
            <i class="fas fa-circle" /> Units
          </a>
        </nav>
        {this.isActiveTab(tab.MAP) && (
          <UIMap bottomUIHeight={this.getBottomHeight()} />
        )}
        {this.isActiveTab(tab.UNITS) && <UIUnit />}
      </div>
    );
  }
}
