import { h, render, Component } from "preact";
/** @jsx h */

import "./styles.scss";
import "react";
import Draggable from "react-draggable";
import game from "../../../game";

const viewportSelector = "#viewport";

const $viewport = () => $("#viewport");
const $window = () => $("#window");

export default class UIMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottomUIHeight: props.bottomUIHeight,
      actualMap: {
        width: 0,
        height: 0
      },
      actualViewport: {
        width: 0,
        height: 0
      },
      uiMap: {
        width: 0,
        height: 0
      },
      uiViewport: {
        width: 50,
        height: 50,
        top: 0,
        right: 0
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bottomUIHeight: nextProps.bottomUIHeight });
    this.updateActualViewportDimensions();
    console.log("componentWillReceiveProps state", this.state);
  }

  componentDidMount() {
    $viewport().draggable({
      containment: "parent",
      drag: this.onViewportDragged.bind(this),
      scroll: false
    });

    this.updateActualViewportDimensions();
    this.updateMapDimenions();

    game.events.on("game.mapupdate", this.updateActualMapDimenions.bind(this));
    game.events.on("game.selectunit", this.onUnitSelected.bind(this));

    $window().resize(this.updateActualViewportDimensions.bind(this));
  }

  onUnitSelected({ position }) {
    let { uiViewport, actualViewport } = this.state;

    this.setState({
      uiViewport: Object.assign(uiViewport, {
        left: position.x * (uiViewport.width / actualViewport.width),
        top: position.y * (uiViewport.height / actualViewport.height)
      })
    });
  }

  updateActualMapDimenions(e) {
    console.log("updateActualMapDimenions", e);
    this.setState({
      actualMap: e.map
    });
    console.log("updateActualMapDimenions state", this.state);
  }

  updateActualViewportDimensions() {
    const { bottomUIHeight } = this.state;

    this.setState({
      actualViewport: {
        width: window.innerWidth,
        height: window.innerHeight - bottomUIHeight
      }
    });

    this.updateViewportDimensions();
  }

  updateMapDimenions() {
    let { clientWidth, clientHeight } = this.mapRef;
    console.log("updateMapDimenions", clientWidth, clientHeight);
    this.setState({
      uiMap: {
        width: clientWidth,
        height: clientHeight
      }
    });
  }

  updateViewportDimensions() {
    let { actualViewport, actualMap, uiMap } = this.state;

    this.setState({
      uiViewport: {
        width: (actualViewport.width / actualMap.width) * uiMap.width,
        height: (actualViewport.height / actualMap.height) * uiMap.height
      }
    });
  }

  onViewportDragged(e, { position }) {
    let { actualViewport, uiViewport } = this.state;
    game.events.emit("ui.viewportdragged", {
      position: {
        x: position.left * (actualViewport.width / uiViewport.width),
        y: position.top * (actualViewport.height / uiViewport.height)
      }
    });

    uiViewport.top = position.top;
    uiViewport.left = position.left;

    this.setState({
      viewport: uiViewport
    });
  }

  // This isn't being served yet

  render() {
    console.log("#viewport");

    let { uiViewport } = this.state;

    return (
      <section ref={ref => (this.mapRef = ref)} id="map">
        <div
          ref={ref => (this.viewportRef = ref)}
          id="viewport"
          style={{
            height: uiViewport.height + "px",
            width: uiViewport.width + "px",
            top: uiViewport.top + "px",
            left: uiViewport.left + "px"
          }}
        />
        <h2>A map will go here</h2>
      </section>
    );
  }
}
