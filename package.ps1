param(
    [Parameter(Mandatory=$true)]
    [string]$OutFile
)

# Check if output file has .zip extension
if (-not $OutFile.EndsWith(".zip")) {
    Write-Host "Error: Output file must have .zip extension"
    exit 1
}

# Convert to absolute path
$OutFile = Resolve-Path -Path $OutFile -ErrorAction SilentlyContinue
if (-not $OutFile) {
    # Create absolute path manually if path doesn't exist
    $OutFile = Join-Path -Path (Get-Location) -ChildPath $args[0]
}

# Create temporary directory
$tmpDir = Join-Path -Path $env:TEMP -ChildPath ([System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tmpDir | Out-Null

# Copy directories
$dirs = @("images", "resources", "dist")
foreach ($dir in $dirs) {
    if (Test-Path -Path ".\$dir") {
        Copy-Item -Path ".\$dir" -Destination "$tmpDir\" -Recurse
    } else {
        Write-Host "Warning: Directory .\$dir not found"
    }
}

# Copy files
$files = @("manifest.json", "PRIVACY.md", "README.md")
foreach ($file in $files) {
    if (Test-Path -Path ".\$file") {
        Copy-Item -Path ".\$file" -Destination "$tmpDir\"
    } else {
        Write-Host "Warning: File .\$file not found"
    }
}

# Create zip archive
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tmpDir, $OutFile)

# Cleanup
Remove-Item -Recurse -Force $tmpDir

Write-Host "Archive created: $OutFile" 