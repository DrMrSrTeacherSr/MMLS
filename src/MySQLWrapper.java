import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class MySQLWrapper implements IWrapper{

	private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
	private static final String DB_URL = "jdbc:mysql://localhost/stockDB";

	private static final String USER = "root";
	private static final String PASS = "4thegalaxytabs";

	public MySQLWrapper() {
		// TODO Auto-generated constructor stub
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
				if (!ticker.equals(rs.getString("symbol"))){ //does not contain the key
					if (tickerPrices != null && ticker != null){
						Double[] tickerArray = (Double[])tickerPrices.toArray();
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
	}

	@Override
	public int predict() {
		// TODO Auto-generated method stub
		return 0;
	}

}
