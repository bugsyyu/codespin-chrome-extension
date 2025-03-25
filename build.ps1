# Exit on any error
$ErrorActionPreference = "Stop"

Write-Host "Cleaning dist directory..."
if (Test-Path -Path dist) {
    Remove-Item -Recurse -Force dist
}
New-Item -ItemType Directory -Path dist

Write-Host "Compiling TypeScript files to JavaScript..."
npm run build

Write-Host "Copying CSS files..."
# Copy CSS files, preserving directory structure within dist
Get-ChildItem -Path src -Filter "*.css" -Recurse | ForEach-Object {
    $targetPath = Join-Path -Path "dist" -ChildPath $_.FullName.Substring((Resolve-Path "src").Path.Length)
    $targetDir = Split-Path -Path $targetPath -Parent
    if (-not (Test-Path -Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    Copy-Item -Path $_.FullName -Destination $targetPath -Force
}

Write-Host "Copying JS files..."
# Copy JS files, preserving directory structure within dist
Get-ChildItem -Path src -Filter "*.js" -Recurse | ForEach-Object {
    $targetPath = Join-Path -Path "dist" -ChildPath $_.FullName.Substring((Resolve-Path "src").Path.Length)
    $targetDir = Split-Path -Path $targetPath -Parent
    if (-not (Test-Path -Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    Copy-Item -Path $_.FullName -Destination $targetPath -Force
}

Write-Host "Build complete! Individual .js and .css files are in the dist directory with original structure." 