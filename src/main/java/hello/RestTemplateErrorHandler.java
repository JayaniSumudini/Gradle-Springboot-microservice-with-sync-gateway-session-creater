package hello;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;

/**
 * @license Copyright (c) 2016 GE Transportation. All rights reserved. The
 *          software may be used and/or copied only with the written permission
 *          of GE Transportation or in accordance with the terms and conditions
 *          stipulated in the agreement/contract under which the software has
 *          been supplied.
 * 
 * @author Mohamed Sabith
 * @Date 2016/12/27
 * 
 */
@Component
public class RestTemplateErrorHandler implements ResponseErrorHandler {

	private static final Logger logger = LoggerFactory.getLogger(RestTemplateErrorHandler.class);

	@Override
	public void handleError(ClientHttpResponse clientHttpResponse) throws IOException {
		logger.info(clientHttpResponse.getStatusText());
	}

	@Override
	public boolean hasError(ClientHttpResponse clientHttpResponse) throws IOException {

		HttpStatus.Series series = clientHttpResponse.getStatusCode().series();
		return (HttpStatus.Series.CLIENT_ERROR.equals(series) || HttpStatus.Series.SERVER_ERROR.equals(series));
	}

}
