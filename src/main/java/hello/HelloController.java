package hello;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class HelloController {
@Autowired
    RestTemplate restTemplate;

    private String syncGateUrl = "http://localhost:4985/todo/"; // enter syncGate url here

    Model model = new Model();

    @RequestMapping(value = "/microService", method = RequestMethod.POST)
    public ResponseEntity addMapUsers(@RequestBody Model model) {
        System.out.println(model);
        System.out.println("MapUsers name: " + model.getTitle());
            model.setCompleted(true);
            String id = model.get_id();
            restTemplate.put( syncGateUrl + id , model);
            return new ResponseEntity(HttpStatus.OK);
        }
    }
    

