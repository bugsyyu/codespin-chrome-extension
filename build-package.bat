@echo off
echo Starting build and package process...

REM Check if output filename argument is provided
if "%~1"=="" (
    echo Error: Please provide an output filename
    echo Usage: build-package.bat output_file.zip
    exit /b 1
)

REM Check if output file has .zip extension
if not "%~x1"==".zip" (
    echo Error: Output file must have .zip extension
    exit /b 1
)

echo Running build script...
powershell -ExecutionPolicy Bypass -InputFormat Text -OutputFormat Text -File .\build.ps1
if %ERRORLEVEL% neq 0 (
    echo Build failed, exiting
    exit /b %ERRORLEVEL%
)

echo Running package script...
powershell -ExecutionPolicy Bypass -InputFormat Text -OutputFormat Text -File .\package.ps1 %1
if %ERRORLEVEL% neq 0 (
    echo Packaging failed, exiting
    exit /b %ERRORLEVEL%
)

echo Build and package completed! Output file: %1 