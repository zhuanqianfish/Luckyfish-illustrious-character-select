easy to use stable-diffusion-webui for WAI-NSFW-illustrious-SDXL https://civitai.com/models/827184?modelVersionId=1183765

To install: Go to settings tab of stable-diffusion-webui, go to install from url, paste in this url and click install:

setting your custom by edit 
custom_character.json
custom_action.json
custom_settings.json

if new Character release can see https://civitai.com/articles/8977/epis-embedding-maps-and-graphs
then update the wai_character2.json

WAI-NSFW-illustrious-SDXL 專用角色選擇器

可以編輯
custom_character.json -> 增加新人物
custom_action.json -> 自訂動作(可將自訂其他promot 放入作為隨機使用)
custom_settings.json -> 部分選項的自訂值

更新 !!!!!如新功能無法使用請砍掉重新安裝!!!!

2/20 小調整及翻譯，處理切換太快產生當機bug，新增分開的隨機按鈕

2/15 更新AI功能(預設、建議可自行申請API Key)、部分角色名稱修正、免額外下載檔案，AI使用上目前 llama-3.3-70b-versatile 有點兩光，可能會吐中文，可在AI擴充最後加入，請用英文回答，即可解決(最好還是自建或找個靠譜的....)

1/19 更新AI功能、部分角色名稱修正、下載Timeout 延長至10分鐘

AI 功能 支援 各家API ex: groq llama-3.3-70b-versatile (免費) 

設定方式:

extensions\WAI-NSFW-illustrious-character-select\custom_settings.json

將 ai 設定為 true

並輸入 api_key (自行自 https://console.groq.com/ 申請)

ex:

    "ai": true,
    
    "base_url": "https://api.groq.com/openai/v1/chat/completions",
    
    "model": "llama-3.3-70b-versatile",
    
    "api_key":"gsk_UGQDzQaAxXrWx9ycd9OlW--------------------"
    


