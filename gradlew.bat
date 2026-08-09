@echo off
set SCRIPT_DIR=%~dp0
if exist "%SCRIPT_DIR%android\gradlew.bat" (
    cd /d "%SCRIPT_DIR%android"
    call gradlew.bat %*
) else (
    echo Error: android\gradlew.bat not found
    exit /b 1
)
