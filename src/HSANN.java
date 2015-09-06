import java.util.ArrayList;
import java.util.List;


public class HSANN {

	List<Double> buffer = new ArrayList<Double>();
	ANN minor;
	ANN major;
	int counter = 0;
	
	public HSANN() {
		int[] hiddenMinor = {30,30,10};
		minor = new ANN(1, hiddenMinor, 1);
		
		int[] hiddenMajor = {25,50,25};
		major = new ANN(20, hiddenMajor, 1);
		
		run();
	}
	
	public void run(){
		for(int j = 0; j < 2000; j ++){
			double[] value = {function(counter)};
			double[] count = {counter%20};
			buffer.add(minor.test(count, value)[2]);
			counter++;
			double[] majorIn = new double[20];
			if(buffer.size() > 20){
				buffer.remove(0);
				for(int i = 0; i < 20; i++){
					majorIn[i] = buffer.get(i);
				}
				double[] out = major.test(majorIn, value);
				System.out.println("batch end " + out[0] + " : " + out[1] +  " : " + out[2] + " : " + value[0]);
			}
		}
	}
	
	

	private double function(int counter){
		return (Math.sin(Math.pow(counter,2)/200.0) + 1)/2.3;
	}
	
	/**
	 * main
	 * 
	 * @param args
	 */
	public static void main(String[] args){
		
		new HSANN();
	}

	
}
