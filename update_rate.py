import requests
import json
import os

# 从 GitHub Secrets 中读取 API Key
api_key = os.getenv('EXCHANGE_RATE_API_KEY')
url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/USD"

try:
    response = requests.get(url)
    data = response.json()
    if data['result'] == 'success':
        # 只提取我们需要的数据，减少文件体积
        result = {
            "base": "USD",
            "rates": {
                "CNY": data['conversion_rates']['CNY'],
                "JPY": data['conversion_rates']['JPY']
            },
            "last_update": data['time_last_update_utc']
        }
        # 保存到本地文件
        with open('rate.json', 'w') as f:
            json.dump(result, f, indent=4)
        print("汇率更新成功！")
except Exception as e:
    print(f"更新失败: {e}")
