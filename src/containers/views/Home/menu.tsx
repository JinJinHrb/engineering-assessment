import React from 'react'
import loadable from '@loadable/component'
import { VideoCameraOutlined, CodeSandboxOutlined } from '@ant-design/icons'

import PageLoading from '@components/PageLoading'

const loadableOptions = { fallback: <PageLoading /> }
export const asynchronousComponents = {
  GeoLocation: loadable(() => import('@views/GeoLocation'), loadableOptions),
  AntdLab: loadable(() => import('@views/AntdLab'), loadableOptions),
}

// all routers key
export type AsynchronousComponentKeys = keyof typeof asynchronousComponents

export interface IMenu {
  title: string
  id: number
  pid?: number
  path?: string
  icon?: JSX.Element
  component?: AsynchronousComponentKeys
  exact?: boolean
}

export interface IMenuInTree extends IMenu {
  children?: IMenuInTree[]
}

export const menu: IMenu[] = [
  {
    id: 1,
    path: '/',
    title: 'Geolocation',
    icon: <VideoCameraOutlined />,
    component: 'GeoLocation',
  },
  {
    id: 2,
    path: '/antd-lab',
    title: 'Antd Lab',
    icon: <CodeSandboxOutlined />,
    component: 'AntdLab',
    exact: true,
  },
]

export default menu
