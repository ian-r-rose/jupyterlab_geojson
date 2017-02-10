import React from 'react';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

Leaflet.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.0.2/dist/images/';

export default class Component extends React.Component {
  
  constructor(props) {
    super(props);
    this.element = null;
    this.map = null;
    this.geoJSONLayer = null;
  }

  componentDidMount(): void {
    this.map = Leaflet.map(this.element);
    this.map.scrollWheelZoom.disable();
    this.tileLayer = Leaflet.tileLayer('http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/celestia_mars-shaded-16k_global/{z}/{x}/{y}.png', {
      attribution : '',
      minZoom : 0,
      maxZoom : 5,
      tms: true
    }).addTo(this.map);
    this.geoJSONLayer = Leaflet.geoJson(this.props.data).addTo(this.map);
    this.map.fitBounds(this.geoJSONLayer.getBounds());
    // Hack: Leaflet maps don't display all tiles unless the window is
    // resized or `map.invalidateSize()` is called. 
    // https://github.com/Leaflet/Leaflet/issues/694
    setTimeout(() => this.map.invalidateSize(), 1000);
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.data !== nextProps.data);
  }

  componentDidUpdate(prevProps) {
    this.map.removeLayer(this.geoJSONLayer);
    this.geoJSONLayer = Leaflet.geoJson(this.props.data).addTo(this.map);
    this.map.fitBounds(this.geoJSONLayer.getBounds());
    // Hack: Leaflet maps don't display all tiles unless the window is
    // resized or `map.invalidateSize()` is called. 
    // https://github.com/Leaflet/Leaflet/issues/694
    setTimeout(() => this.map.invalidateSize(), 1000);
  }

  render() {
    return (
      <div
        ref={element => this.element = element}
        style={{ 
          height: 600, 
          width: '100%' 
        }}
      />
    );
  }

}
