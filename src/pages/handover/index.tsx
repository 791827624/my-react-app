import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { css } from '@emotion/css'
import { useRequest } from 'ahooks'
import { Button, Col, Input, message, Modal, Row, Select, Table, Tag } from 'antd'
import axios from 'axios'
import { useBatchRequest } from 'hooks/useBatchFetch'
import { get, reverse, sortBy, unionBy } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { HandoverModal } from './Modal'

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
    { entryId: '5f8f98247161b80006c55192', entryName: '客户资源表' },
    { entryId: '5f8f989f8a879400065605c2', entryName: '基础合同' },
    { entryId: '600e7656a72a6f00073f4576', entryName: '加申' },
    { entryId: '60a4a89eae49f40007b6279d', entryName: '加申' },
    { entryId: '6712241cd41ea8d184e7c6c6', entryName: '本科中期规划工作表' },
    { entryId: '6732e98b6589e318d8ed481d', entryName: '本科申请季进度表' },
    { entryId: '603080d9f532e100075b4cc9', entryName: '转案' },
    { entryId: '60a35cbe8b4b950007d2ff42', entryName: '终版' },
    { entryId: '604efc489c082600072ba09b', entryName: '方案条目表' },
    { entryId: '60a222f6f0c2b40007009c93', entryName: '学生材料库' },
    { entryId: '60a5d63163ea180008bb5ed6', entryName: '确认入读/延期入读' },
    { entryId: '5f8f995e143c580007fd7936', entryName: '确认入读/延期入读' },
    { entryId: '609b86636c7c7500079d3d55', entryName: 'FC Worksheet_New' },
    { entryId: '6037095ac103cf0007007b9d', entryName: '客户综合信息表' },
    { entryId: '60374b39563847000788cbe9', entryName: '院校申请进度表' },
    { entryId: '60dd65d4e247730008d66b68', entryName: '递交表' },
    { entryId: '6095e8f92642ab0008337435', entryName: '文创工作任务表' },
    { entryId: '60f65afac15d390008d1489b', entryName: '学生文书集合' },
  ])
  const [salesType, setSalesType] = useState<'cultural' | 'service' | 'sales'>('sales')
  const [studentId, setStudentId] = useState<string>('')
  const [deps, setDeps] = useState<any[]>([])
  const [saleIdInput, setSaleIdInput] = useState('')
  const [name, setName] = useState('')
  const [manager, setManagerInput] = useState('')
  const [local, setLocal] = useState('')
  const [department, setDepartmentInput] = useState('')
  const [entryMapStatus, setEntryMapStatus] = useState<any>({})
  const [dataIds, setDataIds] = useState<any>({})
  const [studentInfos, setStudentInfos] = useState<any[]>([])
  const [allStudent, setAllStudents] = useState<any[]>([])
  const [isTransform, setIsTransform] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  const studentIds = useMemo(() => studentId?.split(' '), [studentId])

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
      onSuccess({ data }: any) {
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

  const { runAsync: runTransformRecord } = useRequest(
    async () => {
      await dataGetter.post('/batch_create', {
        app_id: APP_ID,
        entry_id: '61c2921214dfbe000719d58c',
        data_list: allStudent?.map((sdt: any) => {
          return {
            lx_id: {
              value: get(sdt, 'lx_id'),
            },
            sales_json: {
              value: saleIdInput,
            },
            department: {
              value: department,
            },
            type: { value: '再分配' },
          }
        }),
      })
    },
    {
      manual: true,
    }
  )

  const { runAsync: runHandovered } = useRequest(
    async () => {
      await dataGetter.post('/batch_create', {
        app_id: APP_ID,
        entry_id: '611ca27acaf9e60008142aed',
        data_list: allStudent?.map((sdt: any) => {
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
    async (ids: any, entry_id: string) => {
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

  const { start, loading, finished } = useBatchRequest(
    batcherSearch,
    formIds.map(item => item.entryId)
  )

  const { runAsync: runEdit } = useRequest(
    async (entry_id: any, data_ids: any) => {
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

      if (isTransform) {
        delete data.is_handover
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
    reset: editResest,
  } = useBatchRequest(
    batcherEdit,
    formIds.map(item => item.entryId)
  )

  const onHandover = useCallback(async () => {
    batchEditStart()
  }, [batchEditStart])

  //编辑完成后立即执行回调并且清空批量调用的状态避免重复触发
  useEffect(() => {
    if (editFinished && !editLoading) {
      isTransform ? runTransformRecord() : runHandovered()
      editResest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editFinished, finished, editLoading])

  return (
    <div className={cssHandover}>
      <Button
        size='middle'
        style={{
          width: 100,
        }}
        onClick={() => {
          setVisible(true)
        }}>
        添加
      </Button>
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
        style={{ width: '15%', marginLeft: 'auto' }}
        disabled={loading || !studentIds?.length || !allStudent.length || !studentId || !finished}>
        {loading ? '正在查询...' : '交接'}
      </Button>
      <Table
        dataSource={sortBy(allStudent, x => x.sales_json.name)}
        columns={[
          {
            title: 'ID',
            dataIndex: 'lx_id',
            key: 'lx_id',
            render: (text: any) => text || '-',
          },
          {
            title: '姓名',
            dataIndex: 'student_name',
            key: 'student_name',
            render: (text: any) => text || '-',
          },
          {
            title: '状态',
            dataIndex: 'tag_state',
            key: 'tag_state',
            render: (text: any) => text || '-',
          },
          {
            title: '是否交接',
            dataIndex: 'is_handover',
            key: 'is_handover',
            render: (text: any) => (text ? '是' : '否'),
          },
          {
            title: '签约顾问',
            key: 'sales_json.name',
            render: (_: any, record: any) => record.sales_json?.name || '-',
          },
          {
            title: '所在部门',
            key: 'department.name',
            render: (_: any, record: any) => record.department?.name || '-',
          },
          {
            title: '主管',
            key: 'manager.name',
            render: (_: any, record: any) => record.manager?.name || '-',
          },
          {
            title: '地区',
            dataIndex: 'local',
            key: 'local',
            render: (text: any) => text || '-',
          },
          {
            title: '服务顾问',
            key: 'service_sale.name',
            render: (_: any, record: any) => record.service_sale?.name || '-',
          },
          {
            title: '文创顾问',
            key: 'cultural_sale.name',
            render: (_: any, record: any) => record.cultural_sale?.name || '-',
          },
        ]}
      />

      <HandoverModal
        okDisabled={!finished}
        visible={visible}
        setVisible={setVisible}
        salesType={salesType}
        setSalesType={setSalesType}
        isTransform={isTransform}
        setIsTransform={setIsTransform}
        studentId={studentId}
        setStudentId={setStudentId}
        onClick={onClick}
        studentInfos={studentInfos}
        setAllStudents={setAllStudents}
        loading={loading}
      />
      <Modal open={editLoading}>
        <div>
          {formIds.map(item => {
            return (
              <Row style={{ marginTop: 4, width: 400 }} justify={'space-between'}>
                <Tag>
                  {item.entryId}---{item.entryName}
                </Tag>
                {entryMapStatus[item.entryId] === true ? (
                  <CheckOutlined style={{ color: 'green' }} />
                ) : (
                  entryMapStatus[item.entryId] === false && (
                    <CloseOutlined style={{ color: 'red' }} />
                  )
                )}
              </Row>
            )
          })}
        </div>
      </Modal>
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
