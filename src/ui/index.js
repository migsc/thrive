import { h, render, Component } from "preact";
/** @jsx h */

import linkState from "linkstate";

import BottomUI from "./bottom";

import "./styles.scss";

class App extends Component {
  constructor() {
    super();
    this.state = {
      text: "hello"
    };
  }

  render({}, { text }) {
    return (
      <app>
        <BottomUI />
      </app>
    );
  }
}

// Start 'er up:
render(<App />, document.querySelector("#ui"));
