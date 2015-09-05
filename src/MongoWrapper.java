import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.TreeMap;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;


public class MongoWrapper implements IWrapper{

	private String collectionName;
	private ArrayList<String> parameters;
	private MongoClient mc;
	private DB db;
	private DBCollection coll;

	public MongoWrapper() throws UnknownHostException{
		collectionName = "FinalOutput";
		parameters = new ArrayList<String>();
		//Populate list here using input string

		mc = new MongoClient();
		db = mc.getDB("MasterDB");
		coll = db.getCollection(collectionName);
		
	}

	public void trainNetwork(){
		// send 2D param matrix and 1D/2D results matrix
		int numberOfData = (int) coll.getCount();
		double [][] params = new double [numberOfData][parameters.size()];

		DBCollection lookupTable = db.getCollection(collectionName+"format");
		DBCursor headers = lookupTable.find();
		DBObject headParam = headers.next();

		Map<String, Map<String, Integer>> lookupMap = new TreeMap<String, Map<String,Integer>>();

		DBCursor curs = coll.find();
		int count = 0;
		while(curs.hasNext()){
			DBObject o = curs.next();
			
			for (int ii = 0; ii < parameters.size(); ii++){
				String param = parameters.get(ii);
				if (!param.toLowerCase().equals("_id")){//FILTER OUT '_ID' somewhere
					// Need lookup table for possible values
					String number = (String) headParam.get(param);
					String value = (String) o.get(param);
					try{
						if (value.equals("nan")){ //Set nan to 0
							params[count][ii] = 0;
						} else {
							params[count][ii] = Double.parseDouble(value); //parse any doubles as doubles
						}
					} catch(Exception e){
						if (!number.isEmpty()){
							// Table contains param header
							if (lookupMap.containsKey(param)){
								if (lookupMap.get(param).containsKey(value)){ //and contains param value
									params[count][ii] = lookupMap.get(param).get(value);
								} else { //but does not contain param value
									params[count][ii] = (double) Collections.max(lookupMap.get(param).values());
									lookupMap.get(param).put(value, (int) params[count][ii]);
								}
							} else {
								//Table does not contain param header
								lookupMap.put(param, new TreeMap<String, Integer>());
								params[count][ii] = 1;
								lookupMap.get(param).put(value, (int) params[count][ii]);
							}
						}
					}
				}
			}
			count++;
		}

		// RUN PREDICTION HERE
	}

	public int predict(){
		return 0;
	}

}
