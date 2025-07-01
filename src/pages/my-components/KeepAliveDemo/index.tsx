import { css } from '@emotion/css'
import { Button, Input, Radio, Rate, Select, Slider, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { flexColumnGap8 } from 'index.style'
import { useState } from 'react'
import { CodeBlock } from '../CodeBlock'
import { KeepAlive, KeepAliveProvider } from './keep-alive'

export const KeepAliveDemo = () => {
  const [hidden, setHidden] = useState(false)

  return (
    <div className={cssKeepAliveDemo} style={{ width: '60vw' }}>
      即使切换了视图也可以保持UI组件之前的展示状态 且state也会被保留。
      <KeepAliveProvider>
        {!hidden ? (
          <KeepAlive name={'div1'}>
            <div className={flexColumnGap8}>
              <Input />
              <TimePicker defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
              <Radio.Group>
                <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio>
              </Radio.Group>
            </div>
          </KeepAlive>
        ) : (
          <KeepAlive name={'div2'}>
            <div className={flexColumnGap8}>
              <Slider defaultValue={30} />
              <Select
                defaultValue='lucy'
                style={{ width: 120 }}
                options={[
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'dawn', label: 'dawn' },
                  { value: 'petter', label: 'petter' },
                ]}
              />
              <Rate />
            </div>
          </KeepAlive>
        )}
      </KeepAliveProvider>
      <Button
        onClick={() => {
          setHidden(!hidden)
        }}
        style={{
          marginTop: 50,
        }}>
        切换视图
      </Button>
      <CodeBlock
        language='typescript'
        darkMode={false}
        maxHeight={500}
        style={{ overflow: 'auto' }}>
        {`
export const KeepAliveDemo = () => {
  const [hidden, setHidden] = useState(false)

  return (
    <div className={cssKeepAliveDemo}>
      即使切换了视图也可以保持UI组件之前的展示状态 且state也会被保留。
      <KeepAliveProvider>
        {!hidden ? (
          <KeepAlive name={'div1'}>
            <div className={flexColumnGap8}>
              <Input />
              <TimePicker defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
              <Radio.Group>
                <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio>
              </Radio.Group>
            </div>
          </KeepAlive>
        ) : (
          <KeepAlive name={'div2'}>
            <div className={flexColumnGap8}>
              <Slider defaultValue={30} />
              <Select
                defaultValue='lucy'
                style={{ width: 120 }}
                options={[
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'dawn', label: 'dawn' },
                  { value: 'petter', label: 'petter' },
                ]}
              />
              <Rate />
            </div>
          </KeepAlive>
        )}
      </KeepAliveProvider>
      <Button
        onClick={() => {
          setHidden(!hidden)
        }}
        style={{
          marginTop: 50,
        }}>
        切换视图
      </Button>

    </div>
  )
}`}
      </CodeBlock>
    </div>
  )
}
export const cssKeepAliveDemo = css`
  padding: 50px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`
