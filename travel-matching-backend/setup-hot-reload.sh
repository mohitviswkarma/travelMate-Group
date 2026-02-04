#!/bin/bash

# TravelMate Hot Reload Setup Script
# This script creates all necessary files for hot reload development

echo "🔥 Setting up Hot Reload for TravelMate Backend"
echo "==============================================="
echo ""

# Create dev.sh
cat > dev.sh << 'EOF'
#!/bin/bash

# Development Commands Script (like npm scripts)

case "$1" in
    dev)
        echo "🔥 Starting development server with hot reload..."
        ./watch-and-run.sh
        ;;
        
    
    start)
        echo "🚀 Starting production server..."
        mvn compile exec:java
        ;;
    
    build)
        echo "📦 Building production JAR..."
        mvn clean package
        ;;
    
    run)
        echo "▶️  Running production JAR..."
        java -jar target/travel-matching-backend-jar-with-dependencies.jar
        ;;
    
    clean)
        echo "🧹 Cleaning project..."
        mvn clean
        ;;
    
    test)
        echo "🧪 Running tests..."
        mvn test
        ;;
    
    *)
        echo "TravelMate Development Scripts"
        echo "=============================="
        echo ""
        echo "Usage: ./dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  dev     - Start development server with hot reload (like nodemon)"
        echo "  start   - Start server without hot reload"
        echo "  build   - Build production JAR"
        echo "  run     - Run production JAR"
        echo "  clean   - Clean build artifacts"
        echo "  test    - Run tests"
        echo ""
        echo "Examples:"
        echo "  ./dev.sh dev    # Start hot reload development"
        echo "  ./dev.sh build  # Build for production"
        ;;
esac
EOF

# Create watch-and-run.sh
cat > watch-and-run.sh << 'EOF'
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
EOF

# Create hot-reload-simple.sh (no dependencies)
cat > hot-reload-simple.sh << 'EOF'
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
EOF

# Make all scripts executable
chmod +x dev.sh watch-and-run.sh hot-reload-simple.sh

echo "✅ Setup complete!"
echo ""
echo "📁 Created files:"
echo "  - dev.sh                  (Main command script)"
echo "  - watch-and-run.sh        (Hot reload with fswatch)"
echo "  - hot-reload-simple.sh    (Simple hot reload, no dependencies)"
echo ""
echo "🚀 Quick Start:"
echo ""
echo "Option 1 (Recommended for macOS):"
echo "  ./dev.sh dev"
echo ""
echo "Option 2 (No dependencies needed):"
echo "  ./hot-reload-simple.sh"
echo ""
echo "🎉 Now edit your Java files and watch them auto-reload!"
echo ""