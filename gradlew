#!/usr/bin/env bash
# Root Gradle wrapper delegate for AndroidIDE
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -f "$ROOT_DIR/android/gradlew" ]; then
    cd "$ROOT_DIR/android"
    chmod +x ./gradlew
    exec ./gradlew "$@"
else
    echo "Error: android/gradlew script not found at $ROOT_DIR/android/gradlew"
    exit 1
fi
