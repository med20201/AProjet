#!/bin/bash

# Navigate to your project directory
cd "$(dirname "$0")"

# Start JSON server
echo "Starting JSON server..."
nohup json-server --watch db.json --port 3000 &

# Install dependencies
echo "Installing dependencies..."
npm install

# Run tests (optional)
echo "Running tests..."
npm test

# Build the APK
echo "Building APK..."
cd android
./gradlew assembleRelease

# Move the APK to a desired location
APK_OUTPUT_PATH="app/build/outputs/apk/release/app-release.apk"
DESTINATION_PATH="../app-release.apk"
if [ -f "$APK_OUTPUT_PATH" ]; then
    echo "Moving APK to the project root..."
    cp "$APK_OUTPUT_PATH" "$DESTINATION_PATH"
    echo "APK has been moved to $DESTINATION_PATH"
else
    echo "APK build failed or APK not found at $APK_OUTPUT_PATH"
fi

echo "Build and server startup complete."
