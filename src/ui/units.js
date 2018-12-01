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

  render() {
    let { selectedUnit, unitsByName } = this.state;
    let { style } = this.props;

    console.log("unitsByName", unitsByName);

    return (
      <section style={style} id="units">
        <div id="collection" class="container is-dark">
          {Object.values(unitsByName).map(u => (
            <p>{u.name}</p>
          ))}
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
