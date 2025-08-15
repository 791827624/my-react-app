import { Button, Checkbox, Input, Modal, Row, Select, Table } from 'antd'
import { sortBy } from 'lodash'

interface HandoverModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  salesType: 'cultural' | 'service' | 'sales'
  setSalesType: (type: 'cultural' | 'service' | 'sales') => void
  isTransform: boolean
  setIsTransform: (transform: boolean) => void
  studentId: string
  setStudentId: (id: string) => void
  onClick: () => void
  studentInfos: Array<{
    lx_id: string
    student_name: string
    tag_state: string
    is_handover: boolean
    sales_json: { name: string }
    department: { name: string }
    manager: { name: string }
    local: string
    service_sale: { name: string }
    cultural_sale: { name: string }
  }>
  setAllStudents: React.Dispatch<any>
  okDisabled: boolean
  loading: boolean
}

export const HandoverModal = ({
  visible,
  setVisible,
  salesType,
  setSalesType,
  isTransform,
  setIsTransform,
  studentId,
  setStudentId,
  onClick,
  studentInfos,
  setAllStudents,
  okDisabled,
  loading,
}: HandoverModalProps) => {
  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      width={'70vw'}
      okButtonProps={{ disabled: okDisabled }}
      onOk={() => {
        setAllStudents(studentInfos)
        setVisible(false)
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 20,
        }}>
        <Row
          style={{
            display: 'flex',
            gap: 12,
          }}>
          <span>交接顾问种类:</span>
          <Select
            value={salesType}
            onChange={(e: 'cultural' | 'service' | 'sales') => setSalesType(e)}
            options={[
              { value: 'sales', label: '签约顾问' },
              { value: 'service', label: '服务顾问' },
              { value: 'cultural', label: '文创顾问' },
            ]}
          />
        </Row>
        <Row
          style={{
            display: 'flex',
            gap: 12,
          }}>
          <span>是否为轮转:</span>
          <Checkbox checked={isTransform} onChange={e => setIsTransform(e.target.checked)} />
        </Row>
        <Row
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}>
          <span>
            学生id :<span style={{ color: 'red', fontSize: 10 }}>(空格隔开)</span>
          </span>
          <Input
            value={studentId}
            onChange={v => setStudentId(v.target.value?.replace(/-/g, '').trim())}
          />
        </Row>
        <Button onClick={onClick} type='primary'>
          查询
        </Button>
        <Table
          loading={loading}
          dataSource={sortBy(studentInfos, x => x.sales_json.name)}
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
      </div>
    </Modal>
  )
}
