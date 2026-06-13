# 域名与 HTTPS 后续 TODO

更新时间：2026-06-13

本文给下一任负责人使用，说明后续如何给官网绑定域名并配置 HTTPS。本文不记录任何后台密码、服务器登录密码、`SESSION_SECRET` 或 SSH 私钥。

## 当前状态

```text
当前访问地址：http://43.129.197.63
当前域名：暂未绑定
HTTPS：暂未配置
服务器位置：中国香港 VPS
公网 IP：43.129.197.63
```

当前使用 IP 访问不影响网站和后台功能，但后台登录仍建议后续配置 HTTPS。

## 负责人建议

域名不要放在即将毕业同学的个人账号里。推荐顺序：

1. 优先申请学院或学校二级域名。
2. 如果无法申请二级域名，再由下一任长期负责人、球队公共账号或学院老师账号购买商业域名。
3. 域名账号、续费提醒、解析权限要随交接信息一起交给下一任负责人。

原因：

- 域名需要每年续费。
- 域名控制官网入口，不适合长期绑定毕业生个人账号。
- 手机号、邮箱或账号失效会导致续费、解析和证书维护困难。

## 推荐方案

### 方案 A：学院二级域名

优先推荐。可向学院或学校信息化部门申请类似：

```text
basketball.ai.tyut.edu.cn
ai-basketball.tyut.edu.cn
```

需要问清：

- 是否允许解析到香港 VPS。
- 是否允许部署篮球队官网。
- 是否需要校内审批或信息登记。
- 是否由学校统一配置 HTTPS，还是由服务器自行配置证书。

### 方案 B：购买商业域名

如果学院无法提供二级域名，可购买：

```text
ai-basketball.cn
ai-basketball.com
tyut-ai-basketball.cn
```

建议：

- 优先选择 `.cn` 或 `.com`。
- 使用长期负责人或学院/球队公共账号购买。
- 开启自动续费或至少设置续费提醒。
- 不要购买来源不明的二手域名。

## 备案说明

当前服务器位于中国香港。一般情况下：

- 域名解析到中国香港 VPS：通常不需要 ICP 备案。
- 域名解析到中国大陆服务器：需要 ICP 备案。
- 如果后续使用中国大陆 CDN：通常需要备案。
- 学院二级域名是否需要校内流程，以学校信息化部门要求为准。

如果后续更换到中国大陆服务器，必须先确认备案要求。

## 配置步骤

### 1. 域名解析

在域名 DNS 控制台添加 A 记录：

```text
主机记录：@ 或具体子域名
记录类型：A
记录值：43.129.197.63
TTL：默认即可
```

如果使用 `www`：

```text
主机记录：www
记录类型：A 或 CNAME
记录值：43.129.197.63 或主域名
```

等待解析生效后检查：

```bash
dig 域名 +short
curl -I http://域名
```

### 2. 备份 Nginx 配置

```bash
sudo cp /etc/nginx/sites-available/basketball-team-website \
  /etc/nginx/sites-available/basketball-team-website.$(date +%F-%H%M%S).bak
```

### 3. 修改 Nginx server_name

编辑：

```bash
sudo nano /etc/nginx/sites-available/basketball-team-website
```

把：

```nginx
server_name _;
```

改成实际域名，例如：

```nginx
server_name basketball.example.com;
```

如果有多个域名：

```nginx
server_name basketball.example.com www.basketball.example.com;
```

检查并重载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 验证 HTTP

```bash
curl -s -o /dev/null -w "home:%{http_code}\n" http://域名/
curl -s -o /dev/null -w "admin:%{http_code}\n" http://域名/admin
```

确认 HTTP 可访问后，再配置 HTTPS。

### 5. 安装 Certbot

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### 6. 申请 HTTPS 证书

```bash
sudo certbot --nginx -d 域名
```

如果有 `www`：

```bash
sudo certbot --nginx -d 域名 -d www.域名
```

按提示选择是否把 HTTP 自动跳转到 HTTPS。正式上线建议启用跳转。

### 7. 验证 HTTPS 和自动续期

```bash
curl -s -o /dev/null -w "https home:%{http_code}\n" https://域名/
curl -s -o /dev/null -w "https admin:%{http_code}\n" https://域名/admin
sudo certbot renew --dry-run
```

浏览器检查：

```text
https://域名
https://域名/admin
```

确认浏览器显示安全锁。

## 配置后必须验证

```text
[ ] 首页可访问
[ ] /admin 可访问
[ ] 后台能登录
[ ] 后台能保存
[ ] 后台能上传
[ ] /api/site 返回 Cache-Control: no-store
[ ] /assets/ 图片可访问并可缓存
[ ] 视频 Range 返回 206 Partial Content
[ ] http 自动跳转 https
[ ] certbot renew --dry-run 通过
```

## 回滚方式

如果配置域名或 HTTPS 后异常：

1. 恢复 Nginx 备份配置。
2. 执行 `sudo nginx -t`。
3. 通过后执行 `sudo systemctl reload nginx`。
4. 继续用 `http://43.129.197.63` 访问。

示例：

```bash
sudo cp /etc/nginx/sites-available/basketball-team-website.备份时间.bak \
  /etc/nginx/sites-available/basketball-team-website
sudo nginx -t
sudo systemctl reload nginx
```

如果只是域名解析错误，删除或修正 DNS 记录即可，不需要改网站代码。

## 交接时必须填写

```text
域名：
域名注册商：
域名账号持有人：
域名续费日期：
DNS 控制台地址：
HTTPS 证书工具：
certbot renew --dry-run 最近一次结果：
```

不要把域名账号密码写进 GitHub 文档。账号密码只通过可信渠道交接。
