import 'antd/dist/antd.less'
import './index.scss'

import React from 'react'
import ReactDomClient from 'react-dom/client'
import { configure } from 'mobx'

import App from '@shared/App'
import catchUnhandledRejection from './errorHandler'

configure({ enforceActions: 'observed' })
catchUnhandledRejection()

const root = ReactDomClient.createRoot(document.getElementById('app'))
root.render(<App />)
