import React, { useEffect, useRef, useState } from 'react'
import EChartsReact from 'echarts-for-react'
import * as echarts from 'echarts'
import { cityDataSF } from './utils'
import styles from '../index.module.scss'

const styleMap = {
	guangdong: { height: '100%', width: '100%' },
	SF: { width: '100%', height: '1024px', maxWidth: '800px' },
}

const MapChart = ({ geoJson, customerBatteryCityData, geoCoordMap }) => {
	const [option, setOption] = useState<any>()
	const ref = useRef<any>()

	useEffect(() => {
		if (!geoJson || !customerBatteryCityData || !geoCoordMap) {
			return
		}
		// 注册地图
		echarts.registerMap('guangdong', geoJson)
		if (!ref.current) {
			ref.current = cityDataSF({ customerBatteryCityData, geoCoordMap })
		}
		setOption(ref.current)
	}, [geoJson, customerBatteryCityData, geoCoordMap]) // 空依赖数组意味着这个effect只会在组件挂载时运行一次

	return !option ? (
		<>...</>
	) : (
		// <div id="chart-panel" style={{ marginTop: 0, width: '100%', height: '1200px' }}>
		<EChartsReact option={option} style={styleMap.SF} className={styles.map} />
	)
	// </div>
}

// 假设 customerBatteryCityData 是从props或其他地方获取的
// 你可能需要将其作为props传递给GuangdongMapChart组件，或者将其作为组件的state

export default MapChart
