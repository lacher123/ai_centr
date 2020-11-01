// src/DisplayMapClass.js
import * as React from 'react';

import {heatPoints} from './heatmap';
import {objPoints} from './attraction';

function setPlainMapVisualisation(map)
{
    map.removeLayer(map.curLayer);
}

function setHeatMapVisualisation(map)
{
    map.removeLayer(map.curLayer);
    
    const H = window.H;
    
    var heatmapProvider = new H.data.heatmap.Provider({
        colors: new H.data.heatmap.Colors({
        '0': 'blue',
        '0.2': 'yellow',
        '1': 'red'
        }, true),
        opacity: 0.6,
        assumeValues: false
    });
    
    const dataPoints = heatPoints.map(function(p) {
        return {lng: p.point[0], lat: p.point[1], value: p.heat/2592};
      });

    heatmapProvider.addData(dataPoints);
    const l = new H.map.layer.TileLayer(heatmapProvider);
    map.addLayer(l);
    map.curLayer = l;
}

function setPopulationClusterVisualisation(map)
{
    map.removeLayer(map.curLayer);
    
    const H = window.H;
    const clusterPoints = heatPoints.map(function (p) {
        return new H.clustering.DataPoint(p.point[1], p.point[0], p.heat);
      });

      const clusteredDataProvider = new H.clustering.Provider(clusterPoints, {
        clusteringOptions: {
        eps: 32,
          minWeight: 2
        }
    });
    const l = new H.map.layer.ObjectLayer(clusteredDataProvider);
    map.addLayer(l);
    map.curLayer = l;
}

function getData()
{
  let arr = [];
  for(let i=0; i < objPoints.length; i=i+4) {
      arr.push({"category": objPoints[i], "description": objPoints[i+1], "la": parseFloat(objPoints[i+2]), "lg": parseFloat(objPoints[i+3])});
  }
  return arr;
}

function setInfrastructureClusterVisualisation(map, category)
{
    map.removeLayer(map.curLayer);
    const H = window.H;
    const objs = getData().filter(p => p.category === category);
    const clusterPoints = objs.map(function (p) {
        return new H.clustering.DataPoint(p.lg, p.la);
      });

      const clusteredDataProvider = new H.clustering.Provider(clusterPoints, {
        clusteringOptions: {
        eps: 32,
          minWeight: 2
        }
    });
    const l = new H.map.layer.ObjectLayer(clusteredDataProvider);
    map.addLayer(l);
    map.curLayer = l;
}

function DrawPoint(map, p)
{
    const H = window.H;
    const ui = new H.ui.UI(map);
    const geoPoint = new H.geo.Point(p[1], p[0]);
    const objs = getData();

    
    var nearestObj = objs.filter(function(o) {
        const curPoint = { lng: o.la, lat: o.lg};
        o.dist = geoPoint.distance(curPoint);
        return (o.dist<200);
      });


    let str = "<p><b>Поблизости</b></p>";
    nearestObj.forEach(function(item, index, array) {
        str += ("<p>" + item.description + "<br><b> "+ Math.round(item.dist) + " м</b></p>");
      });
 
    const bubble = new H.ui.InfoBubble({ lng: p[0], lat: p[1] }, {
        content: str
     });
    
    map.setCenter({lat: p[1], lng: p[0]});
    ui.addBubble(bubble);
}

export class DisplayMapClass extends React.Component {
  mapRef = React.createRef();

  state = {
    map: null,
    visualisationType: 'none'
  };

  componentDidMount() {

    const H = window.H;
    const platform = new H.service.Platform({
        apikey: "Lmse5Zj9ayA1ikB-WZvIu_V4hJq110YS3HA-ACZkArU"
    });

    const defaultLayers = platform.createDefaultLayers({lg: "ru-RU"});

    const map = new H.Map(
      this.mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lng: 132.0, lat: 43.175 },
        zoom: 11.5,
        pixelRatio: window.devicePixelRatio || 1
      }
    );

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers, "ru-RU");
    ui.getControl('mapsettings').setDisabled(true);
 
    this.setState({ map });
  }

  componentWillUnmount() {
    this.state.map.dispose();
  }

  render() {

    if (this.props.visualisationType !== this.state.visualisationType) {
     switch (this.props.visualisationType) {
        case 'heatMap':
            setHeatMapVisualisation(this.state.map);
            break;                    
        case 'populationCluster':
            setPopulationClusterVisualisation(this.state.map);
            break;
        case 'infrastructureCluster':
            setInfrastructureClusterVisualisation(this.state.map, this.props.visualisationCategory);
           break;
        default:
            setPlainMapVisualisation(this.state.map);
      }       
    }

    if (this.props.visualisationType === "infrastructureCluster") {
        setInfrastructureClusterVisualisation(this.state.map, this.props.visualisationCategory);
    }

    if (this.props.resPoint[0]>0)
    {
        DrawPoint(this.state.map, this.props.resPoint);
    }

    this.state = { ...this.state, visualisationType: this.props.visualisationType };

    return (
      <div ref={this.mapRef} style={{ height: "calc(100vh - 50px)" }} />
    );
  }
}