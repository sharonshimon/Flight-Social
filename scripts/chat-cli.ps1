<#
PowerShell Chat CLI for Flight-Social
Usage examples (PowerShell):

# set token in environment (optional)
$env:CHAT_TOKEN = '<JWT_TOKEN>'

# List conversations
pwsh ./scripts/chat-cli.ps1 -Action list

# Start a conversation by username with an initial message
pwsh ./scripts/chat-cli.ps1 -Action start -PeerUsername otheruser -Content "Hello from script"

# Fetch messages between you and a peer (requires MyId and PeerId)
pwsh ./scripts/chat-cli.ps1 -Action messages -MyId <yourId> -PeerId <peerId>

# You can also pass -Token directly instead of setting CHAT_TOKEN env var
pwsh ./scripts/chat-cli.ps1 -Action list -Token '<JWT_TOKEN>'

# Notes:
# - Backend default URL is http://localhost:3000. Change $BaseUrl below if needed.
# - This script uses Invoke-RestMethod to return parsed JSON objects.
# - For debugging, use -Verbose to get more details.
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('start','list','messages')]
    [string]$Action = 'list',

    [Parameter(Mandatory=$false)]
    [string]$Token = $env:CHAT_TOKEN,

    [Parameter(Mandatory=$false)]
    [string]$PeerUsername,

    [Parameter(Mandatory=$false)]
    [string]$PeerId,

    [Parameter(Mandatory=$false)]
    [string]$MyId,

    [Parameter(Mandatory=$false)]
    [string]$Content
)

# Configuration
$BaseUrl = 'http://localhost:3000'
if (-not $Token -or $Token -eq '') {
    $Token = Read-Host -Prompt 'JWT token (paste here)'
}

if (-not $Token -or $Token -eq '') {
    Write-Error 'No token provided. Set CHAT_TOKEN env var or pass -Token.'
    exit 2
}

$headers = @{ Authorization = "Bearer $Token" }

try {
    switch ($Action) {
        'list' {
            Write-Output "Listing conversations..."
            $url = "$BaseUrl/api/v1/chat/conversations"
            $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction Stop
            Write-Output (ConvertTo-Json $res -Depth 5)
        }
        'start' {
            if (-not $PeerUsername -and -not $PeerId) {
                Write-Error 'start requires -PeerUsername or -PeerId'
                exit 3
            }
            $payload = @{}
            if ($PeerUsername) { $payload.peerUsername = $PeerUsername }
            if ($PeerId) { $payload.peerId = $PeerId }
            if ($Content) { $payload.content = $Content }

            $url = "$BaseUrl/api/v1/chat/start"
            Write-Output "Starting conversation with $($PeerUsername ?? $PeerId)..."
            $body = $payload | ConvertTo-Json
            $res = Invoke-RestMethod -Uri $url -Headers ($headers + @{ 'Content-Type' = 'application/json' }) -Method Post -Body $body -ErrorAction Stop
            Write-Output "Created message:"
            Write-Output (ConvertTo-Json $res -Depth 5)
        }
        'messages' {
            if (-not $MyId -or -not $PeerId) {
                Write-Error 'messages requires -MyId and -PeerId'
                exit 4
            }
            $url = "$BaseUrl/api/v1/chat/messages/$MyId/$PeerId"
            Write-Output "Fetching messages between $MyId and $PeerId..."
            $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction Stop
            Write-Output (ConvertTo-Json $res -Depth 6)
        }
    }
}
catch {
    Write-Error "Request failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $body = $reader.ReadToEnd()
            Write-Output 'Response body:'
            Write-Output $body
        } catch { }
    }
    exit 1
}
