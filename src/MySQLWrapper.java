import java.sql.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class MySQLWrapper implements IWrapper{

	private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
	private static final String DB_URL = "jdbc:mysql://localhost/stockDB";

	private static final String USER = "root";
	private static final String PASS = "4thegalaxytabs";

	private ANN neuralNetwork;
	private boolean financialData = false;

	public static void main(String[] arg){
		MySQLWrapper a = new MySQLWrapper();
		a.trainNetwork();
	}

	public MySQLWrapper() {
		int [] h = {15,15,15};
		neuralNetwork = new ANN(10, h, 1);
	}

	@Override
	public String trainNetwork() {
		Connection conn = null;
		Statement stmt = null;

		Map<String, Double[]>trainingData = new HashMap<String, Double[]>(); 

		try{
			// Set up and connect to the database
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("Connecting to database...");
			conn = DriverManager.getConnection(DB_URL,USER,PASS);
			System.out.println("Creating statement...");
			stmt = conn.createStatement();
			String sql;
			sql = "SELECT symbol, close_p FROM price";
			ResultSet rs = stmt.executeQuery(sql);

			ArrayList<Double> tickerPrices = null;
			String ticker = null;
			while(rs.next()){
				if (!rs.getString("symbol").equals(ticker)){ //does not contain the key
					if (tickerPrices != null && ticker != null){
						Double[] tickerArray = new Double[tickerPrices.size()];
						for (int ii = 0; ii < tickerArray.length; ii++){
							tickerArray[ii] = tickerPrices.get(ii);
						}
						trainingData.put(ticker, tickerArray);
					}
					tickerPrices = new ArrayList<Double>();
				} 
				ticker = rs.getString("symbol");
				Double closingP = rs.getDouble("close_p");
				tickerPrices.add(closingP);
			}

			rs.close();
			stmt.close();
			conn.close();

		} catch(SQLException se){
			//Handle errors for JDBC
			se.printStackTrace();
		}catch(Exception e){
			//Handle errors for Class.forName
			e.printStackTrace();
		}finally{
			//finally block used to close resources
			try{
				if(stmt!=null)
					stmt.close();
			}catch(SQLException se2){
			}// nothing we can do
			try{
				if(conn!=null)
					conn.close();
			}catch(SQLException se){
				se.printStackTrace();
			}//end finally try
		}//end try

		if (financialData){ //special case
			List<triTuple<Double, Double, Double>> nnData = trainFinancialData(neuralNetwork, trainingData);
			JsonArray dataset = new JsonArray();
			int time = 0;
			for (triTuple<Double, Double, Double> t : nnData){
				JsonObject data = new JsonObject();
				data.addProperty("Time", time);
				data.addProperty("PredictedValues", t.var2);
				data.addProperty("TrueValues", t.var3);
				data.addProperty("StdError", t.var1);
				dataset.add(data);
			}
			JsonObject modelResult = new JsonObject();
			modelResult.add("results", dataset);
			return modelResult.getAsString();
		} else { // general cases
			
		}
		return null;
	}
	
	@Override
	public int predict() {
		
		return 0;
	}
	
	private List<triTuple<Double, Double, Double>> trainFinancialData(ANN neuralNetwork, Map<String, Double[]> trainingData){
		int historyLength = 10;
		List<Double> buffer = new ArrayList<Double>();
		List<triTuple<Double, Double, Double>> resultsList = new ArrayList<triTuple<Double,Double,Double>>();
		
		for (Double[] s : trainingData.values()){
			double max = Double.MIN_VALUE;
			double min = Double.MAX_VALUE;
			buffer = new ArrayList<Double>();
			if (s.length > historyLength) {
				for(double d: s){
					buffer.add(d);
					double[] values = new double[10];
					if(buffer.size() > 10){
						for(int i = 0; i < 10; i++){
							values[i] = buffer.get(i);
						}
						double[] ele= {Math.max(0, Math.min(1.0, (buffer.get(10) - min)/(max-min)))};
						double[] out = neuralNetwork.test(values, ele);
						resultsList.add(new triTuple<Double, Double, Double>(out[0], out[2], ele[0]));
//						System.out.println("batch end " + out[0] + " : " + out[1] +  " : " + out[2] + " : " + ele[0]);
//						if (Double.isNaN(ele[0]))
//							System.exit(1);
						buffer.remove(0);
					}
					max = Math.max(max, d);
					min = Math.min(min, d);
				}
			}
		}
		return resultsList;
	}
	
	protected class triTuple<K,T,L>{
		
		protected K var1;
		protected T var2;
		protected L var3;
		
		public triTuple(K t1, T t2, L t3){
			var1 = t1;
			var2 = t2;
			var3 = t3;
		}
	}

}
