import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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
	private ANN neuralNetwork;

	public static void main(String[] arg) throws UnknownHostException{
		System.out.println("HERE");
		MongoWrapper mw = new MongoWrapper();
		mw.trainNetwork();
	}
	
	public MongoWrapper() throws UnknownHostException{
		int [] h = {15,15,15};
		neuralNetwork = new ANN(10, h, 1);
		
		collectionName = "FinalOutput";
		parameters = new ArrayList<String>();
		//Populate list here using input string

		mc = new MongoClient();
		db = mc.getDB("MNISTDB");
		coll = db.getCollection("test");
	}

	public String trainNetwork(){
		
//		DBCursor curs = coll.find();
////		DBObject o = curs.next();
//		String value = curs.next().toString();
//		System.out.println(value);
//		
//		JsonParser parser = new JsonParser();
//		JsonObject o = (JsonObject)parser.parse(value);
//		System.out.println(o.get("label"));
//		System.out.println(o.get("image").isJsonArray());
//		
//		Gson g = new Gson();
//		int[][] image = g.fromJson(o.get("image"), int[][].class);
//		System.out.println(image.length);
		
		Map<String, ArrayList<Double>> trainingData = new HashMap<String, ArrayList<Double>>();
		
		//Assume standardized form where every field is a double
		DBCursor curs = coll.find();
		while (curs.hasNext()){
			DBObject o = curs.next();
			for (String p : parameters){ //First param is labels
				if (!trainingData.containsKey(p)){
					trainingData.put(p, new ArrayList<Double>());
				}
				trainingData.get(p).add((Double) o.get(p));
			}
		}
		
		// Train network and get prediction
		ArrayList<Double> labels = trainingData.get(0);
		double[][] labelArray = new double [labels.size()][1];
		for (int ii = 0; ii < labels.size(); ii++){
			labelArray[ii][0] = labels.get(ii);
		}
		double[][] featureArray = new double [labels.size()][trainingData.keySet().size()-1];
		int fCount = 0;
		for (String f : trainingData.keySet()){
			ArrayList<Double> vals = trainingData.get(f);
			for (int ii = 0; ii < vals.size(); ii++){
				featureArray[ii][fCount] = vals.get(ii);
			}
		}
		//Train NN
		double[] results = neuralNetwork.train(featureArray, labelArray);
		JsonObject res = new JsonObject();
		res.addProperty("AverageError", results[0]);
		res.addProperty("AverageSaturation", results[1]);
		return res.getAsString();
	}

	public int predict(){
		return 0;
	}

}
