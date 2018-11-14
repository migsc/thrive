import { h, render, Component } from "preact";
/** @jsx h */

import "./styles.scss";

export default class UIBottom {
  downButtonPressed(ev) {
    console.log("you did good kid. keep going");
  }

  render() {
    return (
      <div id="bottom">
        <p>Arrow keys to scroll.</p>
        <button id="#down" type="button" class="btn btn-outline-warning">
          Move down
          <i class="fas fa-arrow-down" />
        </button>
      </div>
    );
  }
}
