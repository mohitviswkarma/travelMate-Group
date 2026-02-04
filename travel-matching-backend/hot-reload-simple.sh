#!/bin/bash

# Simple Hot Reload Development Server (No external dependencies)
# Works on macOS and Linux

echo "🔥 Starting TravelMate in Development Mode"
echo "==========================================="
echo ""

# Function to run server
run_server() {
    echo "🔨 Compiling project..."
    mvn compile -q
    
    if [ $? -eq 0 ]; then
        echo "✅ Compilation successful!"
        
        # Kill old server
        pkill -f "com.travelmate.application.Application" 2>/dev/null
        sleep 1
        
        echo "🚀 Starting server on http://localhost:8080"
        echo ""
        
        # Run in background
        mvn exec:java -Dexec.mainClass="com.travelmate.application.Application" -q &
        SERVER_PID=$!
        
        echo "✅ Server running (PID: $SERVER_PID)"
        echo "💡 Make changes to .java files and save"
        echo ""
    else
        echo "❌ Compilation failed! Fix errors and try again."
    fi
}

# Initial run
run_server

# Simple watch loop using find
echo "👀 Watching for changes... (Press Ctrl+C to stop)"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    LAST_TIME=$(find src -name "*.java" -type f -exec stat -f "%m" {} \; | sort -n | tail -1)
else
    # Linux
    LAST_TIME=$(find src -name "*.java" -type f -printf '%T@\n' | sort -n | tail -1)
fi

while true; do
    sleep 2
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        CURRENT_TIME=$(find src -name "*.java" -type f -exec stat -f "%m" {} \; | sort -n | tail -1)
    else
        # Linux
        CURRENT_TIME=$(find src -name "*.java" -type f -printf '%T@\n' | sort -n | tail -1)
    fi
    
    if [ "$CURRENT_TIME" != "$LAST_TIME" ]; then
        echo "🔄 Change detected! Reloading..."
        echo ""
        run_server
        LAST_TIME=$CURRENT_TIME
    fi
done
