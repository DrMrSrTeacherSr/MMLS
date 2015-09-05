import java.sql.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MySQLWrapper implements IWrapper{

	private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
	private static final String DB_URL = "jdbc:mysql://localhost/stockDB";

	private static final String USER = "root";
	private static final String PASS = "4thegalaxytabs";
	
	private ANN neuralNetwork;

	public static void main(String[] arg){
		MySQLWrapper a = new MySQLWrapper();
		a.trainNetwork();
	}

	public MySQLWrapper() {
		int [] h = {15,15,15};
		neuralNetwork = new ANN(10, h, 1);
	}

	@Override
	public void trainNetwork() {
		Connection conn = null;
		Statement stmt = null;

		Map<String, Double[]>trainingData = new HashMap<String, Double[]>(); 

		try{
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
		

		int counter = 0;
		for (Double[] s : trainingData.values()){
			if (s.length > 10) {
				double[] buffer = new double[10];
				Double[] dataSet = s;
				double max = Double.MIN_VALUE, min = Double.MAX_VALUE;
				for (int ii = 0; ii < buffer.length; ii++){
					buffer[ii] = (double)dataSet[ii];
					max = Math.max(max, buffer[ii]);
					min = Math.min(min, buffer[ii]);
				}
				double theEleventhAngel = dataSet[10];
				theEleventhAngel = (theEleventhAngel - min)/(max - min);
				double[]labels = {theEleventhAngel};
				System.out.println(neuralNetwork.test(buffer, labels)[1]);
				++counter;
			}
			if (counter > 20)
				break;
		}
		

	}

	@Override
	public int predict() {
		// TODO Auto-generated method stub
		return 0;
	}

}
