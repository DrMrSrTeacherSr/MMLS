import java.net.UnknownHostException;

import com.mongodb.BasicDBList;
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
			db = mongoClient.getDB("MasterDB");
			coll = db.getCollection("mnist");
			
			BasicDBObject query = new BasicDBObject("training",0);
			DBCursor data = coll.find(query);
			while(data.hasNext()){
				DBObject temp = data.next();
				int label = (int) temp.get("label");
				BasicDBList image = (BasicDBList) temp.get("image");

				for(int i = 0; i < image.size(); i++){
					System.out.println(image.get(i));	
				}
			}
			
			System.out.println(db.getCollectionNames());
			
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		
		
	}

	public static void main(String[] args){
		new HandWritingWrapper();
	}
	
}
