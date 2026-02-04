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
