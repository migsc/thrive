import { h, render, Component } from "preact";
/** @jsx h */

import game from "../game";

import UIUnits from "./units";
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

  onUnitSelected() {
    this.setState({
      activeTab: tab.UNITS
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
          <button
            type="button"
            class={`btn ${this.isActiveTab(tab.MAP) ? "active" : ""}`}
            onClick={() => this.setActiveTab(tab.MAP)}
          >
            MAP
          </button>

          <button
            type="button"
            class={`btn ${this.isActiveTab(tab.UNITS) ? "active" : ""}`}
            onClick={() => this.setActiveTab(tab.UNITS)}
          >
            UNITS
          </button>
        </nav>
        <UIMap
          bottomUIHeight={this.getBottomHeight()}
          style={{ display: this.isActiveTab(tab.MAP) ? "block" : "none" }}
        />
        <UIUnits
          style={{ display: this.isActiveTab(tab.UNITS) ? "flex" : "none" }}
        />
      </div>
    );
  }
}
