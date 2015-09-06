import java.net.UnknownHostException;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;


public class HandWritingWrapper {

	private MongoClient mongoClient;
	private DB db;
	private DBCollection coll;

	
	public HandWritingWrapper() {
		try {
			mongoClient = new MongoClient();
			db = mongoClient.getDB("MNISTDB");
			coll = db.getCollection("training");
			
			BasicDBObject query = new BasicDBObject("test",0);
			DBCursor data = coll.find(query);
			while(data.hasNext()){
				DBObject temp = data.next();
				byte label = (byte) temp.get("label");
				int[][] image = (int[][]) temp.get("image");

				
				System.out.println(label);
				
			}
			
			
			
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		
		
	}

	public static void main(String[] args){
		new HandWritingWrapper();
	}
	
}
