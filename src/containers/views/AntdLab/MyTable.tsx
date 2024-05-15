import { Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useState } from 'react'

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
  description?: string
}

const sharedOnCell = (_: DataType, index: number) => {
  if (index === 4) {
    return { colSpan: 0 }
  }
  return {}
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Applicant',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    // fixed: 'left',
    onCell: (_, index) => ({
      colSpan: (index as number) === 4 ? 9 : 1
    })
  },
  {
    title: 'locationid',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    // fixed: 'left',
    onCell: sharedOnCell
  },
  {
    title: 'FacilityType',
    dataIndex: 'address',
    key: '1',
    width: 150,
    onCell: sharedOnCell
  },
  {
    title: 'LocationDescription',
    dataIndex: 'address',
    key: '2',
    width: 150,
    onCell: sharedOnCell
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: '3',
    width: 150,
    onCell: sharedOnCell
  },
  {
    title: 'Status',
    dataIndex: 'address',
    key: '4',
    width: 150,
    onCell: sharedOnCell
  },
  {
    title: 'FoodItems',
    dataIndex: 'address',
    key: '5',
    width: 150,
    onCell: sharedOnCell
  },
  {
    title: 'Latitude',
    dataIndex: 'address',
    key: '6',
    width: 150,
    onCell: sharedOnCell
  },
  {
    title: 'Longitude',
    dataIndex: 'address',
    key: '7',
    width: 150,
    onCell: sharedOnCell
  },
  { title: 'Schedule', dataIndex: 'address', key: '8' },
  {
    title: 'Approved',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: (text, record, index) => {
      if (index === 4) {
        return null
      }
      return <a>action</a>
    }
  }
]

const data: DataType[] = []
for (let i = 0; i < 100; i++) {
  if (i === 4) {
    data.push({
      key: i,
      name: `报错信息`,
      age: -1,
      address: ''
    })
  } else {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`
    })
  }
}

const App: React.FC = () => {
  const [fixedTop, setFixedTop] = useState(false)

  return (
    <Table
      columns={columns}
      dataSource={data}
      scroll={{ x: 1500 }}
      summary={() => (
        <Table.Summary fixed={fixedTop ? 'top' : 'bottom'}>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <Switch
                checkedChildren="Fixed Top"
                unCheckedChildren="Fixed Top"
                checked={fixedTop}
                onChange={() => {
                  setFixedTop(!fixedTop)
                }}
              />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={8}>
              Scroll Context
            </Table.Summary.Cell>
            <Table.Summary.Cell index={10}>Fix Right</Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
      sticky
    /* expandable={{
        expandedRowRender: record => <p style={{ margin: 0 }}>{record.description ?? '空缺'}</p>,
        rowExpandable: () => true
    }} */
    />
  )
}

export default App
