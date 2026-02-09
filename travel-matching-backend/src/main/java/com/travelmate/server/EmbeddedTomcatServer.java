package com.travelmate.server;

import java.io.File;

import org.apache.catalina.Context;
import org.apache.catalina.startup.Tomcat;
import org.apache.tomcat.util.descriptor.web.FilterDef;
import org.apache.tomcat.util.descriptor.web.FilterMap;

import com.travelmate.websocket.ChatWebSocket;

import jakarta.servlet.Filter;
import jakarta.servlet.http.HttpServlet;
import jakarta.websocket.server.ServerContainer;

public class EmbeddedTomcatServer {

    private static final int PORT = 8085;
    private final Tomcat tomcat;
    private final Context context;

    public EmbeddedTomcatServer() {
        this.tomcat = new Tomcat();
        this.tomcat.setPort(PORT);

        // Initialize connector FIRST
        this.tomcat.getConnector();

        String docBase = new File(".").getAbsolutePath();
        this.context = tomcat.addContext("", docBase);

        // 🔥 REQUIRED for WebSockets in embedded Tomcat
        this.context.addApplicationListener(
            org.apache.tomcat.websocket.server.WsContextListener.class.getName()
        );
    }

    public void registerServlet(String servletName, String urlPattern, HttpServlet servlet) {
        Tomcat.addServlet(context, servletName, servlet);
        context.addServletMappingDecoded(urlPattern, servletName);
    }

    public void registerFilter(String filterName, String urlPattern, Filter filterInstance) {
        FilterDef filterDef = new FilterDef();
        filterDef.setFilterName(filterName);
        filterDef.setFilterClass(filterInstance.getClass().getName());
        filterDef.setFilter(filterInstance);

        context.addFilterDef(filterDef);

        FilterMap filterMap = new FilterMap();
        filterMap.setFilterName(filterName);
        filterMap.addURLPattern(urlPattern);

        context.addFilterMap(filterMap);
    }

    public void matchingServlet(String servletName, String urlPattern, HttpServlet servlet) {
        Tomcat.addServlet(context, servletName, servlet);
        context.addServletMappingDecoded(urlPattern, servletName);
    }

    public void matchingFilter(String filterName, String urlPattern, Filter filterInstance) {
        // 1. Define the Filter
        FilterDef filterDef = new FilterDef();
        filterDef.setFilterName(filterName);
        filterDef.setFilterClass(filterInstance.getClass().getName());
        filterDef.setFilter(filterInstance); 
        
        context.addFilterDef(filterDef);

        // 2. Map the Filter to a URL pattern (e.g., /api/matching/*)
        FilterMap filterMap = new FilterMap();
        filterMap.setFilterName(filterName);
        filterMap.addURLPattern(urlPattern);
        
        context.addFilterMap(filterMap);
    }

    public void start() {
    try {
        // 🔥 START TOMCAT FIRST
        tomcat.start();

        // 🔥 NOW the WebSocket container exists
        ServerContainer wsContainer =
            (ServerContainer) context.getServletContext()
                .getAttribute("jakarta.websocket.server.ServerContainer");

    //    System.out.println("WS CONTAINER = " + wsContainer);

        // 🔥 REGISTER WS ENDPOINT
        wsContainer.addEndpoint(ChatWebSocket.class);
    //    System.out.println("✅ WS endpoint registered: /ws/chat");

        System.out.println("🚀 Server running on port 8085");
        tomcat.getServer().await();

    } catch (Exception e) {
        e.printStackTrace();
    }
}

}
