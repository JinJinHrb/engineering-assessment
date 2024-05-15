import React from 'react'
// import MySelect from './components/MySelect'
// import Charts from './components/Charts'
import MapChart from './sanFrancisco'
// import { createStore, useStore } from 'zustand'
// import rawGeoJson from './sanFrancisco/assets/guang-dong.json'
import rawGeoJson from './sanFrancisco/assets/san-francisco-ca_.geojson.json'
import { customerBatteryCityData, geoCoordMap } from './sanFrancisco/assets/cityData'
import styles from './index.module.scss'

const geoJson = rawGeoJson as any

export const GeoLocation = () => {
	return (
		<div className={styles.container}>
			<MapChart geoJson={geoJson} customerBatteryCityData={customerBatteryCityData} geoCoordMap={geoCoordMap} />
		</div>
	)
}

export default GeoLocation
