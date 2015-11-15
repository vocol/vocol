package webservice.syntaxvalidation;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.ws.rs.POST;
import javax.ws.rs.Path;

@Path("/syntaxvalidation")
public class RequestHandler {

	@Path("/receive")
	@POST
	public String HandleRequest(String _content) throws IOException {

		System.out.println("Start");

		// Split received content and get filename
		String[] contentArray = _content.split("StringToSplit");

		//String tempFile = contentArray[0];
		String tempFile ="tempFile.ttl";
		String message = "";
		// Delete if tempFile exists
		File fileTemp = new File(tempFile);
		if (fileTemp.exists()) {
			fileTemp.delete();
		}
		
		// create a temp file
		File temp = new File(tempFile);

		// write it
		BufferedWriter bw = new BufferedWriter(new FileWriter(temp));
		bw.write(contentArray[1]);
		bw.close();

		Process pr = Runtime.getRuntime()
				.exec(new String[] { "sh", "-c", "rapper -i turtle " + tempFile + " -c 2>&1" });

		BufferedReader input = new BufferedReader(new InputStreamReader(pr.getInputStream()));
		String line = null;

		try {
			while ((line = input.readLine()) != null) {
				message += line;
			}
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (temp.exists()) {
			temp.delete();
		}

		System.out.println("End");
		return message.replaceAll("tempFile.ttl", contentArray[0]);
	}

}
