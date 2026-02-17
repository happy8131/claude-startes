# Claude Code 권한 요청 Slack 알림 스크립트
# Notification 이벤트 중 permission_prompt 타입 처리

# UTF-8 인코딩 설정 (이모지 지원)
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

# permission_prompt 타입만 처리
if ($data.notification_type -ne "permission_prompt") {
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
$message = if ($data.message) { $data.message } else { "(내용 없음)" }
$title = if ($data.title) { $data.title } else { "권한 요청" }

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

# Slack 페이로드 구성 (Block Kit 형식)
$payload = @{
    text = "🔐 Claude Code 권한 요청 - $projectName"
    blocks = @(
        @{
            type = "header"
            text = @{ type = "plain_text"; text = "🔐 Claude Code 권한 요청"; emoji = $true }
        },
        @{
            type = "section"
            fields = @(
                @{ type = "mrkdwn"; text = "*제목:*`n$title" },
                @{ type = "mrkdwn"; text = "*프로젝트:*`n$projectName" }
            )
        },
        @{
            type = "section"
            text = @{ type = "mrkdwn"; text = "*요청 내용:*`n$message" }
        },
        @{
            type = "context"
            elements = @(
                @{ type = "mrkdwn"; text = "⏰ $now  |  세션: $sessionId" }
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
