package webservice.syntaxvalidation;

import java.io.IOException;

import com.sun.jersey.api.container.httpserver.HttpServerFactory;
import com.sun.net.httpserver.HttpServer;

public class Server {

	@SuppressWarnings("restriction")
	public static void main(String[] args) throws IllegalArgumentException, IOException {
		
		String protocol = "http://";
        String port = ":3002/";
        String hostname ="localhost"; 
        String baseUrl = protocol + hostname + port;
        @SuppressWarnings("restriction")
		final HttpServer server = HttpServerFactory.create(baseUrl);
        server.start();
        System.out.println("Web Service for Syntax Validation using JenaRiot is listening on: " + baseUrl + "\n [kill the process to exit]");

	}

}
