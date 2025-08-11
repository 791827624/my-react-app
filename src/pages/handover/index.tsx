import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { css } from '@emotion/css'
import { useRequest } from 'ahooks'
import { Button, Col, Input, message, Row, Select, Tag } from 'antd'
import axios from 'axios'
import { useBatchRequest } from 'hooks/useBatchFetch'
import { get, reverse, sortBy, unionBy } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'

const dataGetter = axios.create({
  baseURL: '/jiandaoyun/api/v5/app/entry/data',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer sfiRPknvrrts2Onfd7kCufIp1FwbP8qX',
  },
})
const corpGetter = axios.create({
  baseURL: '/jiandaoyun/api/v5/corp/department',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer sfiRPknvrrts2Onfd7kCufIp1FwbP8qX',
  },
})

const TYPE_MAP = {
  cultural: 'cultural_sale',
  service: 'service_sale',
  sales: 'sales_json',
}
// name_gu || service_name
const APP_ID = '5f8f970b3c72850006ca3b0d'

const CUSTOMER_ENTRY_ID = '5f8f98247161b80006c55192'

const SALES_DEP_ID = '103'

const SERVICE_DEP_ID = '59'

const CUL_DEP_ID = '60'

//https://api.jiandaoyun.com/api/v5/app/entry/data/list
export const Handover = () => {
  const [formIds] = useState([
    '5f8f98247161b80006c55192', // 客户资源表
    '5f8f989f8a879400065605c2', // 基础合同
    '600e7656a72a6f00073f4576', // 加申
    '60a4a89eae49f40007b6279d', // 加申
    '6712241cd41ea8d184e7c6c6', // 本科中期规划工作表
    '6732e98b6589e318d8ed481d', // 本科申请季进度表
    '603080d9f532e100075b4cc9', // 转案
    '60a35cbe8b4b950007d2ff42', // 终版
    '604efc489c082600072ba09b', // 方案条目表
    '60a222f6f0c2b40007009c93', // 学生材料库
    '60a5d63163ea180008bb5ed6', // 确认入读/延期入读
    '5f8f995e143c580007fd7936', // 确认入读/延期入读
    '609b86636c7c7500079d3d55', // FC Worksheet_New
    '6037095ac103cf0007007b9d', // 客户综合信息表
    '60374b39563847000788cbe9', // 院校申请进度表
    '60dd65d4e247730008d66b68', // 递交表
    '6095e8f92642ab0008337435', // 文创工作任务表
    '60f65afac15d390008d1489b', // 学生文书集合
  ])
  const [salesType, setSalesType] = useState<'cultural' | 'service' | 'sales'>('sales')
  const [studentId, setStudentId] = useState<string | undefined>('')
  const [deps, setDeps] = useState<any[]>([])
  const [saleIdInput, setSaleIdInput] = useState('')
  const [name, setName] = useState('')
  const [manager, setManagerInput] = useState('')
  const [local, setLocal] = useState('')
  const [department, setDepartmentInput] = useState('')
  const [entryMapStatus, setEntryMapStatus] = useState<any>({})
  const [dataIds, setDataIds] = useState<any>({})
  const [studentInfos, setStudentInfos] = useState<any>([])

  const studentIds = useMemo(() => studentId?.split(' '), [studentId])

  console.log('🚀 ~ Handover ~ dataIds:', studentInfos, studentIds, dataIds)

  useRequest(
    async () => {
      const dept_no =
        salesType === 'sales'
          ? SALES_DEP_ID
          : salesType === 'cultural'
            ? CUL_DEP_ID
            : SERVICE_DEP_ID

      return await corpGetter.post('/list', {
        dept_no,
        has_child: true,
      })
    },
    {
      refreshDeps: [salesType],
      onSuccess({ data }) {
        const { departments } = data
        setDeps(
          reverse(
            sortBy(
              departments.map((o: { dept_no: any; name: any }) => {
                return {
                  ...o,
                  value: o.dept_no,
                  label: o.name,
                }
              }),
              'name'
            )
          )
        )
      },
    }
  )

  const { runAsync: runHandovered } = useRequest(
    async () => {
      await dataGetter.post('/batch_create', {
        app_id: APP_ID,
        entry_id: '611ca27acaf9e60008142aed',
        data_list: studentInfos?.map((sdt: any) => {
          return {
            lx_id: {
              value: get(sdt, 'lx_id'),
            },
            name: {
              value: get(sdt, 'student_name'),
            },
            old: {
              value: get(sdt, `${TYPE_MAP[salesType]}.name`),
            },
            new: { value: name },
          }
        }),
      })
    },
    {
      manual: true,
    }
  )

  const { runAsync: studentsFetcher } = useRequest(
    async (ids, entry_id) => {
      console.log('🚀 ~ Handover ~ value:', ids)
      const response = await dataGetter.post('/list', {
        app_id: APP_ID,
        entry_id,
        filter: {
          cond: [
            {
              type: 'text',
              method: 'in',
              value: ids,
              entryId: entry_id,
              hasEmpty: false,
              field: entry_id === '609b86636c7c7500079d3d55' ? 'studentid' : 'lx_id',
            },
          ],
          rel: 'and',
        },
        limit: 100,
        skip: 0,
        sort: [],
      })

      if (entry_id === CUSTOMER_ENTRY_ID) {
        const studentIdMap = unionBy(
          response.data.data.map((std: { lx_id: any; studentid: any }) => ({
            ...std,
            lx_id: std.lx_id,
          })),
          (item: any) => item.lx_id || item.studentid
        )
        setStudentInfos(studentIdMap)
      }
      console.log('🚀 ~ Handover ~ response.data.data:', response.data.data)

      setDataIds((v: any) => ({
        ...v,
        [entry_id]: response.data.data.map((x: { _id: any }) => x._id),
      }))

      return response
    },
    {
      manual: true,
    }
  )

  const batcherSearch = useCallback(
    (item: any) => studentsFetcher(studentIds, item),
    [studentIds, studentsFetcher]
  )

  const { start, loading, finished } = useBatchRequest(batcherSearch, formIds)

  const { runAsync: runEdit } = useRequest(
    async (entry_id, data_ids) => {
      let data: any = {}

      if (salesType === 'sales') {
        data = {
          sales_json: {
            value: saleIdInput, //关联数据
          },
          manager: {
            value: manager, //关联数据
          },
          department: {
            value: department, //关联数据
          },
          departments: {
            value: [department], //关联数据
          },
          local: {
            value: local, //关联数据
          },
          is_handover: {
            value: 'Y',
          },
          name: {
            value: name,
          },
        }
      } else if (salesType === 'service') {
        data = {
          service_sale: {
            value: saleIdInput, //关联数据
          },
          service_manager: {
            value: manager, //关联数据
          },
          service_department: {
            value: department, //关联数据
          },
          service_local: {
            value: local, //关联数据
          },
          service_name: {
            value: name, //关联数据
          },
          name_gu: {
            value: name, //关联数据
          },
        }
      } else if (salesType === 'cultural') {
        data = {
          cultural_sale: {
            value: saleIdInput, //关联数据
          },
          cultural_manager: {
            value: manager, //关联数据
          },
          cultural_department: {
            value: department, //关联数据
          },
          cultural_local: {
            value: local, //关联数据
          },
          cultural_name: {
            value: name, //关联数据
          },
        }
      }

      const response = await dataGetter.post('/batch_update', {
        app_id: APP_ID,
        entry_id,
        data_ids,
        data,
      })

      setEntryMapStatus((v: any) => {
        return {
          ...v,
          [entry_id]: response.data.status === 'success',
        }
      })
      return response
    },
    {
      manual: true,
    }
  )

  const onClick = useCallback(async () => {
    if (!studentId) return message.error('请输入学生ID')
    start()
  }, [studentId, start])

  const batcherEdit = useCallback((item: any) => runEdit(item, dataIds[item]), [dataIds, runEdit])

  const {
    start: batchEditStart,
    finished: editFinished,
    loading: editLoading,
  } = useBatchRequest(batcherEdit, formIds)

  const onHandover = useCallback(async () => {
    batchEditStart()
  }, [batchEditStart])

  useEffect(() => {
    if (editFinished && finished && !editLoading) {
      runHandovered()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editFinished, finished, editLoading])

  return (
    <div className={cssHandover}>
      <Row
        align={'middle'}
        justify={'start'}
        gutter={20}
        style={{ fontSize: 32, fontWeight: 1000, marginBottom: 16 }}>
        <strong> 交接顾问种类:</strong>

        <Select
          value={salesType}
          onChange={e => setSalesType(e)}
          style={{
            width: 400,
            marginLeft: 20,
          }}
          size='large'
          options={[
            { value: 'sales', label: '签约顾问' },
            { value: 'service', label: '服务顾问' },
            { value: 'cultural', label: '文创顾问' },
          ]}
        />
      </Row>
      <Row align={'middle'} justify={'start'} gutter={24}>
        <Col>
          <strong>学生id:</strong>
          <Input
            value={studentId}
            size='large'
            style={{
              width: 500,
              marginLeft: 20,
            }}
            onChange={v => setStudentId(v.target.value?.replace(/-/g, '').trim())}
          />
        </Col>
        <Col>
          <Button onClick={onClick} type='primary' size='large'>
            查询
          </Button>
        </Col>
      </Row>
      {!!studentInfos.length &&
        sortBy(studentInfos, x => x.sales_json.name)?.map((sdt: any) => {
          return (
            <Row gutter={12} style={{ width: '100%' }}>
              <Col>
                学生信息：
                <Tag color='green'>id:{get(sdt, 'lx_id')}</Tag>
                <Tag color='green'>姓名:{get(sdt, 'student_name')}</Tag>
                <Tag color='green'>状态:{get(sdt, 'tag_state')}</Tag>
                <Tag color='green'>是否交接:{get(sdt, 'is_handover')}</Tag>
              </Col>
              <Col>
                签约顾问：
                <Tag color='green'>{get(sdt, 'sales_json.name')}</Tag>
              </Col>
              <Col>
                签约顾问所在部门：
                <Tag color='green'>{get(sdt, 'department.name')}</Tag>
              </Col>
              <Col>
                签约顾问主管：
                <Tag color='green'>{get(sdt, 'manager.name')}</Tag>
              </Col>
              <Col>
                签约顾问所在地区：
                <Tag color='green'>{get(sdt, 'local')}</Tag>
              </Col>
              <Col>
                服务顾问：
                <Tag color='green'>{get(sdt, 'service_sale.name')}</Tag>
              </Col>
              <Col>
                文创顾问：
                <Tag color='green'>{get(sdt, 'cultural_sale.name')}</Tag>
              </Col>
            </Row>
          )
        })}
      <Row align={'middle'} gutter={4}>
        <Col
          style={{
            fontWeight: 800,
            fontSize: 16,
            color: 'red',
          }}>
          交接给：
        </Col>
      </Row>
      <Row align={'middle'} gutter={4}>
        <Col span={6}>
          ID
          <Input value={saleIdInput} onChange={e => setSaleIdInput(e.target.value)} />
        </Col>
        <Col span={6}>
          NAME
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Col>
        <Col span={6}>
          主管ID
          <Input value={manager} onChange={e => setManagerInput(e.target.value)} />
        </Col>
        <Col span={6}>
          所在地区
          <Input value={local} onChange={e => setLocal(e.target.value)} />
        </Col>
        <Col span={6}>
          部门ID
          <Select
            options={[
              ...deps,
              {
                label: '运营',
                value: 37,
              },
            ]}
            style={{ width: '100%' }}
            value={department}
            onChange={v => setDepartmentInput(v)}
          />
        </Col>
      </Row>
      <Button
        type='primary'
        onClick={() => onHandover()}
        disabled={loading || !studentIds?.length || !studentId || !finished}>
        {loading ? '正在查询...' : '交接'}
      </Button>
      {/* <div>
        {JSON.stringify({
          app_id: APP_ID,
          data_ids: studentInfo._id,
          data: {
            sales_json: {
              value: saleIdInput, //关联数据
            },
            manager: {
              value: manager, //关联数据
            },
            department: {
              value: department, //关联数据
            },
            departments: {
              value: [department], //关联数据
            },
            local: {
              value: local, //关联数据
            },
          },
        })}
      </div> */}

      <div>
        {formIds.map(id => {
          return (
            <Row style={{ marginTop: 4, width: 300 }} justify={'space-between'}>
              <Tag>{id}</Tag>
              {entryMapStatus[id] === true ? (
                <CheckOutlined style={{ color: 'green' }} />
              ) : (
                <CloseOutlined style={{ color: 'red' }} />
              )}
            </Row>
          )
        })}
      </div>
    </div>
  )
}

const cssHandover = css`
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .form {
    display: flex;
    gap: 16px;
    > :first-child {
      width: 200px;
    }
  }
  .weather-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    font-family: 'Arial', sans-serif;
  }

  .weather-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .weather-header h2 {
    color: #333;
    margin: 0;
  }

  .update-time {
    color: #666;
    font-size: 0.9em;
  }

  .weather-current {
    text-align: center;
    margin: 20px 0;
  }

  .temperature .value {
    font-size: 3em;
    font-weight: bold;
    color: #2c3e50;
  }

  .weather-condition {
    display: block;
    font-size: 1.5em;
    color: #3498db;
  }

  .weather-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .detail-item {
    background: rgba(255, 255, 255, 0.7);
    padding: 10px;
    border-radius: 5px;
  }

  .detail-item .label {
    display: block;
    color: #7f8c8d;
    font-size: 0.9em;
  }

  .detail-item .value {
    font-weight: bold;
    color: #2c3e50;
  }

  .loading {
    text-align: center;
    padding: 30px;
    color: #7f8c8d;
  }
`
