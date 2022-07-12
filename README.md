# ddns-ipv6
DNSPod ipv6 DDNS JavaScript 脚本

自动获取本机最新ipv6，更新DNSPod的域名AAAA记录

你可以使用 crontab 定时更新

## 前置条件

- node >= 14
- 在DNSPod新增域名AAAA记录
- 配置DNSPod Token https://console.dnspod.cn/account/token/token
- login_token生成规则 https://docs.dnspod.cn/account/dnspod-token

## config

```json
// www.xxx.com

{
    "login_token": "dnspod_token", // 你的token
    "format": "json",              // 必须为json 
    "domain": "xxx.com",           
    "sub_domain": "www"            
}
```
