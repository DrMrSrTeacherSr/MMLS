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
			int[] te = {300};
			ANN nn = new ANN(28*28,te,10);
			BasicDBObject query = new BasicDBObject("test",0);
			DBCursor data = coll.find(query);
			int count = 0;
			while(data.hasNext()){
				DBObject temp = data.next();
				double[] label = {(int) temp.get("label")};
				double[] imageData = new double[28*28];
				BasicDBList image = (BasicDBList) temp.get("image");
				String it ="";
				for(int i = 0; i < image.size(); i++){
					it+=image.get(i).toString();
				}
				it.replace(" ", "");
				String[] strs = it.split(",");
				
				for(int i = 0; i < imageData.length; i++){
					imageData[i] = Double.parseDouble(strs[i]);
				}
				double[]out = nn.test(imageData, label);
				System.out.println(out[0] + " : " + out[1] );
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
