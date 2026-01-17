import requests
import json
import os
from datetime import datetime

def update_exchange_rate():
    # 这里的 API Key 可以换成你自己的，或者使用这个无需 Key 的备用接口
    # 备用接口: https://api.exchangerate-api.com/v4/latest/JPY
    url = "https://api.exchangerate-api.com/v4/latest/JPY"
    
    try:
        print("正在获取最新汇率...")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # 提取日元对人民币的汇率
        # API 返回的是 1 JPY 等于多少 CNY (通常是 0.048 左右)
        cny_rate = data['rates']['CNY']
        
        # 构造网页需要的标准 JSON 结构
        result = {
            "rate": cny_rate,
            "last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "success"
        }
        
        # 写入文件
        with open('rate.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=4)
            
        print(f"成功更新汇率: 1 JPY = {cny_rate} CNY")
        
    except Exception as e:
        print(f"更新失败: {e}")
        # 如果获取失败，创建一个保底的 rate.json，防止网页崩溃
        if not os.path.exists('rate.json'):
            with open('rate.json', 'w', encoding='utf-8') as f:
                json.dump({"rate": 0.048, "last_update": "手动保底值"}, f)

if __name__ == "__main__":
    update_exchange_rate()
