#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
繁体中文转简体中文转换器
将zh_TW.json中的繁体字转换为简体字

依赖安装：
pip install opencc-python-reimplemented
"""

import json
import os
from opencc import OpenCC

def convert_tw_to_cn():
    """将zh_TW.json转换为简体中文"""
    
    # 文件路径
    input_file = 'zh_TW.json'
    output_file = 'zh_CN.json'
    
    # 检查输入文件
    if not os.path.exists(input_file):
        print(f"❌ 文件 {input_file} 不存在")
        return
    
    try:
        # 初始化OpenCC转换器（繁体转简体）
        cc = OpenCC('t2s')  # Traditional Chinese to Simplified Chinese
        
        # 读取繁体JSON文件
        print("📖 正在读取繁体中文数据...")
        with open(input_file, 'r', encoding='utf-8') as f:
            tw_data = json.load(f)
        
        # 转换键名为简体
        cn_data = {}
        converted_count = 0
        
        print("🔄 正在转换繁体为简体...")
        for traditional_key, value in tw_data.items():
            # 转换键名（角色名称）
            simplified_key = cc.convert(traditional_key)
            
            # 值保持不变（通常是英文提示词）
            cn_data[simplified_key] = value
            
            if traditional_key != simplified_key:
                converted_count += 1
                print(f"   转换: {traditional_key} → {simplified_key}")
        
        # 写入简体JSON文件
        print(f"💾 正在保存简体中文数据...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(cn_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 转换完成！")
        print(f"📊 总共转换了 {converted_count} 个字符")
        print(f"📄 输出文件: {output_file}")
        
        # 显示文件大小对比
        tw_size = os.path.getsize(input_file)
        cn_size = os.path.getsize(output_file)
        print(f"📏 文件大小: {tw_size} bytes → {cn_size} bytes")
        
    except ImportError:
        print("❌ 请先安装OpenCC库: pip install opencc-python-reimplemented")
    except Exception as e:
        print(f"❌ 转换过程中出现错误: {e}")

def backup_original():
    """备份原始文件"""
    import shutil
    from datetime import datetime
    
    backup_name = f'zh_TW_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
    shutil.copy2('zh_TW.json', backup_name)
    print(f"💾 已备份原始文件到: {backup_name}")

if __name__ == "__main__":
    print("🚀 开始繁体转简体转换...")
    
    # 可选：备份原始文件
    backup_original()
    
    # 执行转换
    convert_tw_to_cn()