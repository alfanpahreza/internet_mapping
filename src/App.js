import React, { useRef, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import source from './jawa-timur.geojson';
 
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxmYW5wayIsImEiOiJja3Q3dzk3d3cwd2Z4MnBvN2VoNjl5dHloIn0.9Io9o4cQ6EZKiphh8Kjybw';
function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(112.8099); //x axis
    const [lat, setLat] = useState(-7.7599); //y axis
    const [zoom, setZoom] = useState(7); //zoom

    const { Header, Content, Footer } = Layout;

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        }); 
    });

    useEffect(() => {
        if (!map.current) return;
        map.current.on('load', () => { //when map loads
            map.current.addSource(
                'jatim',{
                'type': 'geojson',
                'data': source,
                }
            )
            map.current.addLayer({
                'id': 'polygon',
                'type': 'fill',
                'source': 'jatim', // reference the data source
                'layout': {},
                'paint': {
                    'fill-color': '#58c8ed',
                    'fill-opacity': 0.3,
                },
                'filter': ['==', '$type', 'Polygon'] //filter the types
            });
            map.current.addLayer({
                'id': 'outline',
                'type': 'line',
                'source': 'jatim',
                'layout': { 
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                'paint': {
                    'line-color': '#000',
                    'line-width': 0.5
                },
                'filter': ['==', '$type', 'Polygon']
            });
        })
    })
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <div className="App">
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        Map
                    </Menu.Item>
                    <Menu.Item key="2">
                        Info
                    </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">
                        <div className="sidebar">
                            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                        </div>
                        <div ref={mapContainer} className="map-container" />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>
        </div>
    );
}

export default App;