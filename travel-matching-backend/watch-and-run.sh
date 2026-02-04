#!/bin/bash

# Hot Reload Script using fswatch (works on macOS and Linux)
# Watches for Java file changes and automatically recompiles & restarts

echo "🔥 TravelMate Hot Reload Dev Server"
echo "======================================"
echo ""

# Check if fswatch is installed (works on macOS)
if ! command -v fswatch &> /dev/null; then
    echo "📦 fswatch not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install fswatch
        else
            echo "❌ Please install Homebrew first: https://brew.sh"
            echo "Or install fswatch manually"
            exit 1
        fi
    else
        # Linux
        echo "On Linux, install fswatch with:"
        echo "  Ubuntu/Debian: sudo apt-get install fswatch"
        echo "  Fedora: sudo dnf install fswatch"
        exit 1
    fi
fi

# Function to compile and run
compile_and_run() {
    echo ""
    echo "🔨 Compiling project..."
    mvn compile -q
    
    if [ $? -eq 0 ]; then
        echo "✅ Compilation successful!"
        echo ""
        
        # Kill existing process
        pkill -f "com.travelmate.application.Application" 2>/dev/null
        sleep 1
        
        echo "🚀 Starting server..."
        mvn exec:java \
            -Dexec.mainClass="com.travelmate.application.Application" \
            -Dexec.cleanupDaemonThreads=false &
        
        SERVER_PID=$!
        echo "✅ Server running (PID: $SERVER_PID)"
        echo "📍 http://localhost:8080"
    else
        echo "❌ Compilation failed! Fix errors and save again."
    fi
}

# Initial compilation and run
compile_and_run

echo ""
echo "👀 Watching for changes in src/ directory..."
echo "💡 Edit your Java files and save to trigger reload"
echo "🛑 Press Ctrl+C to stop"
echo ""

# Watch for changes using fswatch
fswatch -o src/ | while read num
do
    echo ""
    echo "🔄 Change detected! Recompiling..."
    compile_and_run
    echo ""
    echo "👀 Watching for changes..."
done
