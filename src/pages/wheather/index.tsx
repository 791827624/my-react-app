import { css } from '@emotion/css'
import { useRequest } from 'ahooks'
import { Button, Card, Input, Spin } from 'antd'
import { getWeather } from 'fetch'
import { useState } from 'react'

export const CITYS = [
  {
    name: '北京',
    pinyin: 'BJ',
    adcode: '110000',
    province: '直辖市',
  },
  {
    name: '上海',
    pinyin: 'SH',
    adcode: '310000',
    province: '直辖市',
  },
  {
    name: '天津',
    pinyin: 'TJ',
    adcode: '120000',
    province: '直辖市',
  },
  {
    name: '重庆',
    pinyin: 'CQ',
    adcode: '500000',
    province: '直辖市',
  },
  {
    name: '合肥',
    pinyin: 'AH',
    adcode: '340000',
    province: '安徽',
  },
  {
    name: '福州',
    pinyin: 'FJ',
    adcode: '350000',
    province: '福建',
  },
  {
    name: '兰州',
    pinyin: 'GS',
    adcode: '620000',
    province: '甘肃',
  },
  {
    name: '广州',
    pinyin: 'GD',
    adcode: '440000',
    province: '广东',
  },
  {
    name: '深圳',
    pinyin: 'SZ',
    adcode: '440300',
    province: '广东',
  },
  {
    name: '贵阳',
    pinyin: 'GZ',
    adcode: '520000',
    province: '贵州',
  },
  {
    name: '海口',
    pinyin: 'HI',
    adcode: '460000',
    province: '海南',
  },
  {
    name: '石家庄',
    pinyin: 'HE',
    adcode: '130000',
    province: '河北',
  },
  {
    name: '郑州',
    pinyin: 'HA',
    adcode: '410000',
    province: '河南',
  },
  {
    name: '哈尔滨',
    pinyin: 'HL',
    adcode: '230000',
    province: '黑龙江',
  },
  {
    name: '武汉',
    pinyin: 'HB',
    adcode: '420000',
    province: '湖北',
  },
  {
    name: '长沙',
    pinyin: 'HN',
    adcode: '430000',
    province: '湖南',
  },
  {
    name: '长春',
    pinyin: 'JL',
    adcode: '220000',
    province: '吉林',
  },
  {
    name: '南京',
    pinyin: 'JS',
    adcode: '320000',
    province: '江苏',
  },
  {
    name: '南昌',
    pinyin: 'JX',
    adcode: '360000',
    province: '江西',
  },
  {
    name: '沈阳',
    pinyin: 'LN',
    adcode: '210000',
    province: '辽宁',
  },
  {
    name: '呼和浩特',
    pinyin: 'NM',
    adcode: '150000',
    province: '内蒙古',
  },
  {
    name: '银川',
    pinyin: 'NX',
    adcode: '640000',
    province: '宁夏',
  },
  {
    name: '西宁',
    pinyin: 'QH',
    adcode: '630000',
    province: '青海',
  },
  {
    name: '济南',
    pinyin: 'SD',
    adcode: '370000',
    province: '山东',
  },
  {
    name: '西安',
    pinyin: 'SX',
    adcode: '610000',
    province: '陕西',
  },
  {
    name: '太原',
    pinyin: 'SX',
    adcode: '140000',
    province: '山西',
  },
  {
    name: '成都',
    pinyin: 'SC',
    adcode: '510000',
    province: '四川',
  },
  {
    name: '拉萨',
    pinyin: 'XZ',
    adcode: '540000',
    province: '西藏',
  },
  {
    name: '昆明',
    pinyin: 'YN',
    adcode: '530000',
    province: '云南',
  },
  {
    name: '杭州',
    pinyin: 'ZJ',
    adcode: '330000',
    province: '浙江',
  },
  {
    name: '香港',
    pinyin: 'HK',
    adcode: '810000',
    province: '特别行政区',
  },
  {
    name: '澳门',
    pinyin: 'MO',
    adcode: '820000',
    province: '特别行政区',
  },
]

export const Wheather = () => {
  const [value, setValue] = useState<string>('上海')
  const [weatherInfo, setWeatherInfo] = useState<any>({})

  const code = CITYS.find((item) => item.name === value)?.adcode || ''

  const { run, data, loading } = useRequest(
    () => {
      return getWeather(code)
    },
    {
      manual: true,
      onSuccess(res) {
        const weatherInfo = res?.data.lives?.[0] || {}
        console.log('🚀 ~ onSuccess ~ weatherInfo:', weatherInfo)

        setWeatherInfo(weatherInfo)
      },
    }
  )

  return (
    <div className={cssWeather}>
      <div className='form'>
        <Input
          value={value}
          onChange={(e) => {
            setWeatherInfo({})
            setValue(e.target.value)
          }}
        />
        <Button onClick={() => run()} type='primary'>
          查询
        </Button>
      </div>
      {loading && <Spin />}
      {code && weatherInfo.weather && (
        <Card
          title={
            <div className='weather-current'>
              <div>{value}</div>
              <div className='temperature'>
                <span className='value'>{weatherInfo.temperature_float}°C</span>
                <span className='weather-condition'>{weatherInfo.weather}</span>
              </div>
            </div>
          }>
          <div className='detail-item'>
            <span className='label'>体感温度</span>
            <span className='value'>{weatherInfo.temperature_float}°C</span>
          </div>
          <div className='detail-item'>
            <span className='label'>最高温度</span>
            <span className='value'>{weatherInfo.temperature_float}°C</span>
          </div>
          <div className='detail-item'>
            <span className='label'>湿度</span>
            <span className='value'>{weatherInfo.humidity}%</span>
          </div>
          <div className='detail-item'>
            <span className='label'>风向</span>
            <span className='value'>{weatherInfo.winddirection}风</span>
          </div>
          <div className='detail-item'>
            <span className='label'>风力</span>
            <span className='value'>{weatherInfo.windpower}级</span>
          </div>
          <div className='detail-item'>
            <span className='label'>区域编码</span>
            <span className='value'>{weatherInfo.adcode}</span>
          </div>
        </Card>
      )}
    </div>
  )
}

const cssWeather = css`
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
