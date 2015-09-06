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
			
			BasicDBObject query = new BasicDBObject("test",0);
			DBCursor data = coll.find(query);
			int count = 0;
			while(data.hasNext()){
				DBObject temp = data.next();
				double[] label = {(int) temp.get("label")};
				double[] imageData = new double[28*28];
				BasicDBList image = (BasicDBList) temp.get("image");

				for(int i = 0; i < image.size(); i++){
					System.out.println(image.get(i).toString());	
				}
				System.out.println("----------------------------------------------");
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
