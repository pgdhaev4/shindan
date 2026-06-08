# App sync & GitHub Pages auto-publish
$ErrorActionPreference = "Continue"

# 絶対パスで固定（日本語フォルダ名対応）
# ※ $APP と foreach ($app ...) の変数名が一致するとPowerShellで上書きされるため $SRC を使用
$SRC  = "C:\Users\有田稔\Desktop\youtube_auto\app"
$REPO = "C:\Users\有田稔\Documents\GitHub\shindan"

$GIT = Get-ChildItem "$env:LOCALAPPDATA\GitHubDesktop" -Recurse -Filter "git.exe" -ErrorAction SilentlyContinue |
       Select-Object -First 1 -ExpandProperty FullName

Write-Host "=== App Publish ===" -ForegroundColor Cyan

# [1] Sync files
Write-Host "[1/3] Syncing files..." -ForegroundColor Yellow
foreach ($name in @("workplace_app", "psychology_app", "kosodate_app")) {
    robocopy "$SRC\$name" "$REPO\$name" /MIR /XD "images_backup" "images_backup2" /E /NP /NJH /NJS | Out-Null
    Write-Host "  $name done"
}
# トップページも同期
if (Test-Path "$SRC\index.html") {
    Copy-Item "$SRC\index.html" "$REPO\index.html" -Force
    Write-Host "  index.html done"
}

# [2] Commit
Write-Host "[2/3] Committing..." -ForegroundColor Yellow
Set-Location $REPO
& $GIT add .
$ts = Get-Date -Format "yyyy-MM-dd HH:mm"
& $GIT commit -m "update: $ts" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Committed: $ts"
} else {
    Write-Host "  No changes to commit" -ForegroundColor Gray
}

# [3] Push
Write-Host "[3/3] Pushing to GitHub..." -ForegroundColor Yellow
& $GIT push origin main
Write-Host ""
Write-Host "=== Published! ===" -ForegroundColor Green
Write-Host "https://pgdhaev4.github.io/shindan/" -ForegroundColor Green

Write-Host ""
Write-Host "Press Enter to close..."
$null = Read-Host
