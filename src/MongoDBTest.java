import java.net.UnknownHostException;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;


public class MongoDBTest {

	public static void main(String[] args) throws UnknownHostException {
		MongoClient mongoClient = new MongoClient("TestClient");
		
		DB db = mongoClient.getDB("testDB");
		
		DBCollection coll = db.getCollection("TestCollection");
		
		BasicDBObject doc = new BasicDBObject("name", "MongoDB")
				.append("type", "databade")
				.append("count", 1)
				.append("info", new BasicDBObject("x", 203).append("y", 102));
		coll.insert(doc);

	}

}
