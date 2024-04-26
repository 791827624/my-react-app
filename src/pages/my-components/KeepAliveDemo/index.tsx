import { Input, Slider, Button, TimePicker, Select, Rate, Radio } from "antd";
import React, { useState } from "react";
import { KeepAliveProvider, KeepAlive } from "./keep-alive";
import dayjs from "dayjs";
import { css } from "@emotion/css";
import { flexColumnGap8 } from "index.style";

export const KeepAliveDemo = () => {
  const [hidden, setHidden] = useState(false);

  return (
    <div className={cssKeepAliveDemo}>
      即使切换了视图也可以保持UI组件之前的展示状态 且state也会被保留。
      <KeepAliveProvider>
        {!hidden ? (
          <KeepAlive name={"div1"}>
            <div className={flexColumnGap8}>
              <Input />
              <TimePicker defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")} />
              <Radio.Group>
                <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio>
              </Radio.Group>
            </div>
          </KeepAlive>
        ) : (
          <KeepAlive name={"div2"}>
            <div className={flexColumnGap8}>
              <Slider defaultValue={30} />
              <Select
                defaultValue="lucy"
                style={{ width: 120 }}
                options={[
                  { value: "lucy", label: "Lucy" },
                  { value: "dawn", label: "dawn" },
                  { value: "petter", label: "petter" },
                ]}
              />
              <Rate />
            </div>
          </KeepAlive>
        )}
        <Button
          onClick={() => {
            setHidden(!hidden);
          }}
          style={{
            marginTop: 50,
          }}
        >
          切换视图
        </Button>
      </KeepAliveProvider>
    </div>
  );
};

const cssKeepAliveDemo = css`
  padding: 50px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;
