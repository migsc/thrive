import { h, render, Component } from "preact";
/** @jsx h */

import game from "../game";
import { ACTION } from "../lib/constants";

export default class UIUnits extends Component {
  constructor() {
    super();
    this.state = {
      selectedUnit: null,
      selectedAction: "",
      unitsByName: {}
    };
    this.unitListItemRefMap = {};
  }

  componentDidMount() {
    game.events.on("game.selectunit", this.onUnitSelectedFromGame.bind(this));
    game.events.on("game.unitsupdate", this.onUnitListReceived.bind(this));
  }

  _onUnitSelected({ unit }) {
    this.setState({
      selectedUnit: unit,
      selectedAction: ""
    });
    this._scrollToUnitInCollection(unit);
  }

  onUnitSelectedFromGame({ unit }) {
    this._onUnitSelected({ unit });
  }

  onUnitSelectedFromUI({ unit }) {
    this._onUnitSelected({ unit });
    game.events.emit("ui.selectunit", { unit });
  }

  onUnitListReceived({ units }) {
    console.log("onUnitListReceived", units);
    this.setState({
      unitsByName: units.reduce((map, u) => {
        map[u.name] = u;
        return map;
      }, {})
    });
  }

  onActionSelected(actionName) {
    this.setState({
      selectedAction: actionName
    });
    game.events.emit("ui.actionselected", { action: actionName });
  }

  _isActionSelected(actionName) {
    let { selectedAction } = this.state;
    return actionName === selectedAction;
  }

  _scrollToUnitInCollection(unit) {
    let unitRef;

    if (!(unitRef = this.unitListItemRefMap[unit.key])) return;

    this.unitListRef.scrollTop = unitRef.offsetTop - unitRef.clientHeight;
  }

  _isUnitSelected(unit) {
    let { selectedUnit } = this.state;
    if (unit.name === selectedUnit.name) return true;
  }

  render() {
    let { selectedUnit, unitsByName } = this.state;
    let { style } = this.props;

    console.log("unitsByName", unitsByName);

    return (
      <section style={style} id="units" class="tab-content">
        <div id="collection" class="container is-dark">
          <div
            ref={ref => {
              this.unitListRef = ref;
            }}
            class="scroll-container"
          >
            <ul>
              {Object.values(unitsByName).map(u => (
                <li class={this._isUnitSelected(u) ? "item selected" : "item"}>
                  <a
                    href="#"
                    onclick={() => this.onUnitSelectedFromUI({ unit: u })}
                    ref={ref => {
                      this.unitListItemRefMap[u.key] = ref;
                    }}
                  >
                    {" "}
                    {u.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="individual" class="container is-dark with-title">
          <label class="title ellipsis">
            {selectedUnit && `${selectedUnit.name} SWARM`}
          </label>

          {selectedUnit && (
            <div>
              <p>
                HP: {selectedUnit.hitPoints}/{selectedUnit.maxHitPoints}
              </p>
              <p>
                MP: {selectedUnit.movingPoints}/{selectedUnit.maxMovingPoints}
              </p>
            </div>
          )}
        </div>
        <div id="actions" class="container is-dark with-title">
          <label class="title">ACTIONS</label>
          {selectedUnit && selectedUnit.canAct() && (
            <ul>
              {selectedUnit.getAvailableActions().map(actionName => (
                <li>
                  <label>
                    <a
                      href="#"
                      onclick={() => this.onActionSelected(actionName)}
                    >
                      <input
                        type="radio"
                        class="radio"
                        name="action"
                        checked={this._isActionSelected(actionName)}
                      />
                      <span>{actionName.toUpperCase()}</span>
                    </a>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }
}
