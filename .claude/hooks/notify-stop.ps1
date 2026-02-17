# Claude Code 작업 완료 Slack 알림 스크립트
# Stop 이벤트 처리

# UTF-8 인코딩 설정
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
$null = chcp 65001 2>$null

# stdin에서 JSON 읽기
$inputText = [System.Console]::In.ReadToEnd()
if (-not $inputText.Trim()) {
    exit 0
}

try {
    $data = $inputText | ConvertFrom-Json
} catch {
    Write-Error "JSON 파싱 실패: $_"
    exit 0
}

# ⚠️ 무한루프 방지: stop_hook_active가 true이면 즉시 종료
if ($data.stop_hook_active -eq $true) {
    exit 0
}

# Slack Webhook URL (User 스코프 → Process 스코프 순으로 읽기)
$webhookUrl = [System.Environment]::GetEnvironmentVariable("SLACK_WEBHOOK_URL", "User")
if (-not $webhookUrl) {
    $webhookUrl = $env:SLACK_WEBHOOK_URL
}
if (-not $webhookUrl) {
    Write-Error "SLACK_WEBHOOK_URL 환경변수가 설정되지 않았습니다"
    exit 0
}

# 데이터 추출
# 세션 ID (앞 8글자만)
$sessionId = if ($data.session_id) {
    $data.session_id.Substring(0, [Math]::Min(8, $data.session_id.Length))
} else {
    "unknown"
}

# cwd에서 프로젝트 폴더명 추출
$projectName = if ($data.cwd) { Split-Path -Leaf $data.cwd } else { "알 수 없음" }

# 현재 시각
$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Slack 페이로드 구성
$payload = @{
    text = "✅ Claude Code 작업 완료 - $projectName"
    blocks = @(
        @{
            type = "header"
            text = @{ type = "plain_text"; text = "✅ Claude Code 작업 완료"; emoji = $true }
        },
        @{
            type = "section"
            fields = @(
                @{ type = "mrkdwn"; text = "*프로젝트:*`n$projectName" },
                @{ type = "mrkdwn"; text = "*완료 시각:*`n$now" }
            )
        },
        @{
            type = "context"
            elements = @(
                @{ type = "mrkdwn"; text = "🤖 Claude Code가 작업을 완료했습니다  |  세션: $sessionId" }
            )
        }
    )
} | ConvertTo-Json -Depth 10 -Compress

# Slack으로 전송
try {
    Invoke-RestMethod -Uri $webhookUrl `
        -Method Post `
        -ContentType "application/json; charset=utf-8" `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($payload)) | Out-Null
} catch {
    Write-Error "Slack 전송 실패: $_"
}

exit 0
