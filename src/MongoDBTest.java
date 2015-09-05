import java.net.UnknownHostException;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;


public class MongoDBTest {

	public static void main(String[] args){
		MongoClient mongoClient;
		try {
			mongoClient = new MongoClient();
		
		
		DB db = mongoClient.getDB("testDB");
		
		DBCollection coll = db.getCollection("TestCollection");
		
		BasicDBObject doc = new BasicDBObject("name", "MongoDB")
				.append("type", "databade")
				.append("count", 1)
				.append("info", new BasicDBObject("x", 203).append("y", 102));
		coll.insert(doc);
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}

}
