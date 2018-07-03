import React from 'react'
import ReactDom from 'react-dom'
import moment from 'moment'
import {
  Upload,
  Icon,
  message,
  LocaleProvider,
  Tabs,
  DatePicker,
  Table,
  Button,
  AutoComplete
} from 'antd'
import { service, api } from './service'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import './index.css'

// const Search = Input.Search
const Dragger = Upload.Dragger
const TabPane = Tabs.TabPane
const { RangePicker } = DatePicker

class AppComponent extends React.Component {
  constructor() {
    super()
    let self = this
    this.state = {
      upload: {
        name: 'file',
        multiple: true,
        action: api.info,
        onChange(info) {
          const status = info.file.status
          if(status === 'done') {
            message.success(`${info.file.name}文件上传成功`)
            self.getProfileSouce()
          }else if(status === 'error') {
            message.error(`${info.file.name}文件上传失败`)
          }
        }
      },
      date: [moment().add(-7, 'days'), moment()],
      columns: [
        {
          title: '用户id',
          dataIndex: 'userId',
          key: 'userId'
        },
        {
          title: '查询证券',
          dataIndex: 'stockName',
          key: 'stockName'
        },
        {
          title: '查询时间',
          dataIndex: 'date',
          key: 'date',
          render: date =>
            moment(moment.unix(date)).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: 'ip地址',
          dataIndex: 'ip',
          key: 'ip'
        }
      ],
      columnsSouce: [
        {
          title: '股票名',
          dataIndex: 'stockName',
          key: 'stockName'
        },
        {
          title: '股票代码',
          dataIndex: 'stockId',
          key: 'stockId'
        }
      ],
      acColumns: [
        {
          title: '序号',
          key: 'index',
          dataIndex: 'index',
          render: (text, record, index) => index + 1
        },
        {
          title: '用户',
          key: 'userId',
          dataIndex: 'userId'
        },
        {
          title: '操作',
          key: 'handle',
          render: (text, record) => (
            <a onClick={this.deleteAcUser.bind(this, record)}>删除</a>
          )
        }
      ],
      acUser: '',
      users: [],
      accessUsers: []
    }
  }
  componentDidMount() {
    this.getProfileSouce()
    this.getUsers()
    this.getAccessUsers()
  }
  changeTab(index) {
    if(+index === 1) {
      this.getProfileSouce()
    }else if(+index === 2) {
      this.getDataSouce()
    }else if(+index === 3) {
      this.getAccessUsers()
    }
  }
  getProfileSouce() {
    let self = this
    service({
      url: api.infos,
      method: 'get',
      data: {}
    }).then(data => {
      self.setState({
        profileSource: data.list
      })
    })
  }
  getDataSouce() {
    let self = this
    service({
      url: api.log,
      method: 'get',
      data: {
        startDate: moment(this.state.date[0]).toDate(),
        endDate: moment(this.state.date[1]).toDate()
      }
    }).then(data => {
      self.setState({
        dataSource: data.list
      })
    })
  }
  handleTableChange(index) {
    console.log(index)
  }
  handleDateChange(date, dateStr) {
    this.state.date = date
    this.setState({
      date: this.state.date
    })
    this.getDataSouce()
  }
  getUsers() {
    let self = this
    service({
      url: api.user,
      method: 'get'
    }).then(data => {
      let list = []
      data.list.forEach(i => {
        list.push(i.userId)
      })
      self.setState({
        users: list
      })
    })
  }
  getAccessUsers() {
    let self = this
    service({
      url: api.acUser,
      method: 'get'
    }).then(data => {
      self.setState({
        accessUsers: data.list
      })
    })
  }
  addAcUser() {
    let self = this
    service({
      url: api.acUser,
      method: 'post',
      data: {
        userId: self.state.acUser
      }
    }).then(data => {
      if(data.success) {
        message.success('添加成功')
        this.getAccessUsers()
        this.setState({
          acUser: ''
        })
      }
    })
  }
  changeAcUser(acUser) {
    this.setState({
      acUser
    })
  }

  deleteAcUser(record) {
    service({
      url: api.acUser,
      method: 'delete',
      data: record
    }).then(data => {
      if(data.success) {
        message.success('删除成功')
        this.getAccessUsers()
      }
    })
  }
  render() {
    const {
      upload,
      date,
      columns,
      acColumns,
      dataSource,
      columnsSouce,
      profileSource,
      acUser,
      users,
      accessUsers
    } = this.state
    return (
      <div className="main">
        <div className="header">
          <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
            <TabPane
              tab={
                <span>
                  <Icon type="info-circle-o" />证券文件
                </span>
              }
              key="1"
            >
              <div className="content">
                <Dragger {...upload}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件上传</p>
                  <p className="ant-upload-hint">上传xlsx或者xls的excel文件</p>
                </Dragger>
                <Table
                  className="table"
                  align="center"
                  columns={columnsSouce}
                  loading={this.state.loading}
                  pagination={this.state.pagination}
                  dataSource={profileSource}
                  rowKey="id"
                />
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type="profile" />访客记录
                </span>
              }
              key="2"
            >
              <div className="content">
                <RangePicker
                  onChange={this.handleDateChange.bind(this)}
                  value={date}
                />
                <Table
                  className="table"
                  align="center"
                  columns={columns}
                  loading={this.state.loading}
                  pagination={this.state.pagination}
                  dataSource={dataSource}
                  rowKey="id"
                />
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type="user" />权限管理
                </span>
              }
              key="3"
            >
              <div className="content">
                <div>
                  <AutoComplete
                    dataSource={users}
                    style={{ width: 200 }}
                    placeholder="输入无限制人员id"
                    value={acUser}
                    filterOption={(inputValue, option) =>
                      option.props.children
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                    onChange={this.changeAcUser.bind(this)}
                  />
                  <Button
                    style={{ marginLeft: '10px' }}
                    type="primary"
                    onClick={this.addAcUser.bind(this)}
                  >
                    新增
                  </Button>
                </div>
                <Table
                  className="table"
                  align="center"
                  columns={acColumns}
                  loading={this.state.loading}
                  pagination={this.state.pagination}
                  dataSource={accessUsers}
                  rowKey="id"
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
ReactDom.render(
  <LocaleProvider locale={zhCN}>
    <AppComponent />
  </LocaleProvider>,
  document.getElementById('root')
)
