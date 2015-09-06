import java.net.UnknownHostException;
import java.util.ArrayList;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.util.JSON;


public class MongoWrapper {//implements IWrapper{

	private String collectionName;
	private ArrayList<String> parameters;
	private MongoClient mc;
	private DB db;
	private DBCollection coll;

	public static void main(String[] arg) throws UnknownHostException{
		System.out.println("HERE");
		MongoWrapper mw = new MongoWrapper();
		mw.trainNetwork();
	}
	
	public MongoWrapper() throws UnknownHostException{
		collectionName = "FinalOutput";
		parameters = new ArrayList<String>();
		//Populate list here using input string

		mc = new MongoClient();
		db = mc.getDB("MNISTDB");
		coll = db.getCollection("test");
	}

	public String trainNetwork(){
		
		DBCursor curs = coll.find();
		DBObject o = curs.next();
		
		String a = (String) (o.get("test"));

		System.out.println(a);
		Double b = (Double)o.get("label");
		System.out.println(b);
		Double[][] c = (Double[][]) o.get("image");
		
		return null;
		// RUN PREDICTION HERE
	}

	public int predict(){
		return 0;
	}

}
