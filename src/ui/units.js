import { h, render, Component } from "preact";
/** @jsx h */

import game from "../game";

export default class UIUnits extends Component {
  constructor() {
    super();
    this.state = {
      selectedUnit: null,
      unitsByName: {}
    };
    this.unitListItemRefMap = {};
  }

  componentDidMount() {
    game.events.on("game.selectunit", this.onUnitSelected.bind(this));
    game.events.on("game.unitsupdate", this.onUnitListReceived.bind(this));
  }

  onUnitSelected({ unit }) {
    console.log(unit);
    this.setState({
      selectedUnit: unit
    });
    this._scrollToUnitInCollection(unit);
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
                <li>
                  <a
                    href="#"
                    onclick={() => this.onUnitSelected({ unit: u })}
                    ref={ref => {
                      this.unitListItemRefMap[u.key] = ref;
                    }}
                    class={this._isUnitSelected(u) ? "item selected" : "item"}
                  >
                    {" "}
                    {u.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="individual" class="container is-dark">
          {selectedUnit && (
            <div>
              <p>{selectedUnit.name} SWARM</p>
              <p>
                MP: {selectedUnit.movingPoints}/{selectedUnit.maxMovingPoints}
              </p>
            </div>
          )}
        </div>
        <div id="actions" class="container is-dark with-title">
          <label class="title">ACTIONS</label>
          <p> MOVE</p>
        </div>
      </section>
    );
  }
}
