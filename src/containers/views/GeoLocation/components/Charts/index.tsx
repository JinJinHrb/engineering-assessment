import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { getBranchData } from './branchData'
import { getLineChartOptions } from './gridData'

export type MyProps = {
	optionType: keyof typeof OPT_FUN_SET
	style?: any
}

const OPT_FUN_SET = {
	lineChart: getLineChartOptions,
	branch: getBranchData,
}

const Charts = (props: MyProps) => {
	const { optionType } = props

	const getOption = (name: string) => {
		return OPT_FUN_SET[name]()
	}

	return (
		<ReactEcharts
			option={getOption(optionType)}
			notMerge={true}
			lazyUpdate={true}
			// onEvents={onEvents}
			style={{ width: '100%', height: '800px' }}
		/>
	)
}

export default Charts
