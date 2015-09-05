import java.util.Random;

public class ANN {

	private Random random = new Random();
	
	private int L;
	
	private double[][][] neuralNetWeights = {{{1},{1}},{{.15,.2}, {.25,.3}},{{.4,.45},{.5,.55}}};

	private double[][] neuralNetBias = {{0,0},{.35,.35},{.6,.6}};

	private double[][] neuralNetActivation;
	private double[][] neuralNetZ;
	
	private double[][] error;

	double weightsLearningRate = .5;
	double biasLearningRate = .5;

	int trialCount = 0;
	
	
	/**
	 * Create an artificial neural network
	 * 
	 * @param inputNodesNum, hiddenNodesNum, outputNodesNum
	 */
	public ANN(int inputNodesNum, int[] hiddenNodesNum, int outputNodesNum) {
		L = hiddenNodesNum.length+2;
		
		neuralNetWeights = new double[L][][];
		neuralNetBias = new double[L][];
		neuralNetActivation = new double[L][];
		neuralNetZ = new double[L][];
		error = new double[L][];

		
		neuralNetWeights[0] = new double[inputNodesNum][1];
		neuralNetBias[0] = new double[inputNodesNum];
		neuralNetActivation[0] = new double[inputNodesNum];
		neuralNetZ[0] = new double[inputNodesNum];
		error[0] = new double[inputNodesNum];

		
		
		neuralNetWeights[1] = new double[hiddenNodesNum[0]][inputNodesNum];
		neuralNetBias[1] = new double[hiddenNodesNum[0]];
		neuralNetActivation[1] = new double[hiddenNodesNum[0]];
		neuralNetZ[1] = new double[hiddenNodesNum[0]];
		error[1] = new double[hiddenNodesNum[0]];

		
		for(int i = 1; i < L - 2; i++){
			neuralNetWeights[i+1] = new double[hiddenNodesNum[i]][hiddenNodesNum[i - 1]];
			neuralNetBias[i+1] = new double[hiddenNodesNum[i]];
			neuralNetActivation[i+1] = new double[hiddenNodesNum[i]];
			neuralNetZ[i+1] = new double[hiddenNodesNum[i]];
			error[i+1] = new double[hiddenNodesNum[i]];

		}
		
		neuralNetWeights[L - 1] = new double[outputNodesNum][hiddenNodesNum[hiddenNodesNum.length-1]];
		neuralNetBias[L - 1] = new double[outputNodesNum];
		neuralNetActivation[L - 1] = new double[outputNodesNum];
		neuralNetZ[L - 1] = new double[outputNodesNum];
		error[L - 1] = new double[outputNodesNum];


		init();
//		System.out.println("Start");
//		System.out.println("------------------------------------");
//		System.out.println(toStringWeights());
//		System.out.println("------------------------------------");
//		System.out.println(toStringBias());
//		System.out.println("------------------------------------");
//		System.out.println(toStringZ());
//		System.out.println("------------------------------------");
//		System.out.println(toStringActivationFunction());
//		System.out.println("------------------------------------");
//		System.out.println("End");
		double[] o = new double[2];
		for(int i = 0; i < 20; i++){
			double t1 = .75;
//			double t2 = Math.random();
			double[] in = {t1};
			double[] out = {Math.pow(t1,2)};
			o = out;
//			out = sigmoidPrime(out);
		
			runTrial(in,out);

		}
		System.out.println("Start");
		System.out.println("------------------------------------");
		System.out.println(toStringWeights());
		System.out.println("------------------------------------");
		System.out.println(toStringBias());
		System.out.println("------------------------------------");
		System.out.println(toStringZ());
		System.out.println("------------------------------------");
		System.out.println(toStringActivationFunction());
		System.out.println("End" + " : " + neuralNetActivation[L-1][0] + " : " + o[0]);
	}
	
	/**
	 * Initializes weights and biases of the neurons
	 */
	public void init(){
		for(int i = 0; i < neuralNetWeights.length; i++){
			for(int j = 0; j < neuralNetWeights[i].length; j++){
				if(i == 0|| i == neuralNetWeights.length-1) neuralNetBias[0][j] = 0;
				else neuralNetBias[i][j] = random.nextGaussian();
				for(int k = 0; k < neuralNetWeights[i][j].length; k++){
					if(i == 0) neuralNetWeights[i][j][k] = 1;
					else neuralNetWeights[i][j][k] = random.nextGaussian() * 1.0/Math.sqrt(neuralNetWeights[i].length);
				}
			}
		}
	}
	
	public void runTrial(double[] in, double[] out){
		feedForward(in);
		backPropogate(out);
		trialCount++;
	}
	
	private void feedForward(double[] inputField){
		for(int i = 0; i < inputField.length; i++){
			neuralNetActivation[0][i] = inputField[i];
		}
		for(int i = 1; (i < L); i++){
			calculateZ(i);
			calculateActivation(i);
		}
	}
	
	private void backPropogate(double[] y){
		calculateErrorL(y);
		calculateErrorl();
		updateNet();
		int sum = 0;
		for(double d : error[L-1]) sum += d;
	}
	
	private void calculateZ(int layer){
		for(int j = 0; j < neuralNetWeights[layer].length; j++){
			neuralNetZ[layer][j] = 0;
			for(int k = 0; k < neuralNetWeights[layer][j].length; k++){
				neuralNetZ[layer][j] += neuralNetWeights[layer][j][k] * neuralNetActivation[layer - 1][k];
			}
			neuralNetZ[layer][j] += neuralNetBias[layer][j];
		}
	}
	
	private void calculateActivation(int layer){
		neuralNetActivation[layer] = sigmoid(neuralNetZ[layer]);
	}
	
	private double[] sigmoid(double[] x){
		double[] out = new double[x.length];
		for(int i = 0; i < x.length; i++)
			out[i] = 1.0/(1.0 + Math.pow(Math.E,-x[i]));
		return out;
	}
	
	private double[] sigmoidPrime(double[] x){
		double[] out = new double[x.length];
		for(int i = 0; i < x.length; i++)
			out[i] = Math.pow(Math.E, x[i])/Math.pow((Math.pow(Math.E, x[i])+1),2);
		return out;
	}
	
	private void calculateErrorL(double[] y){
		error[L - 1] = hadamarProduct(costGradient(L - 1, y),sigmoidPrime(neuralNetZ[L - 1]));
//		System.out.println((error[L-1][0]) + " : " + costGradient(L - 1, y)[0]+ " : " + neuralNetZ[L - 1][0]+ " : " + sigmoidPrime(neuralNetZ[L - 1])[0]);
	}
	
	private void calculateErrorl(){
		for(int i = L - 2; i >= 0; i--){
			error[i] = hadamarProduct(arrayProduct(transpose(neuralNetWeights[i + 1]),error[i+1]),sigmoidPrime(neuralNetZ[i]));
		}
	}
	
	private void updateNet(){
		for(int i = 1; i < neuralNetWeights.length; i++){
			for(int j = 0; j < neuralNetWeights[i].length; j++){
				neuralNetBias[i][j] = neuralNetBias[i][j] - biasLearningRate * biasGradient(i,j);
				for(int k = 0; k < neuralNetWeights[i][j].length; k++){
					neuralNetWeights[i][j][k] = neuralNetWeights[i][j][k] - weightsLearningRate * weightGradient(i,j,k);
				}
			}
		}
	}
	
	private double biasGradient(int l, int j){
		if( l == neuralNetWeights.length-1) return 0;

		return error[l][j];
	}
	
	private double weightGradient(int l, int j, int k){
		return neuralNetActivation[l - 1][k] * error[l][j];
	}
	
	private double[] costGradient(int layer, double[] y){
        double out[] = new double[y.length]; 
		for(int i = 0; i < y.length; i++){
			out[i] = neuralNetActivation[layer][i] - y[i];
		}
		return out;
	}
	
	private double[] hadamarProduct(double[] first, double[] second){
		double[] out = new double[first.length];
		for(int i = 0; i < out.length; i++){
			out[i] = first[i] * second[i];
		}
		return out;
	}
	
	private double[][] transpose(double[][] a){
		double[][] out = new double[a[0].length][a.length];

		for (int i = 0; i < a.length; i++) {
			for (int j = 0; j < a[0].length; j++) {
				double temp = a[i][j];
	            out[j][i] = temp;
	        }
	    }
		
		return out;
	}

	private double[] arrayProduct(double[][] first, double[] second){
        double out[] = new double[first.length]; 
        
        for(int i = 0; i < first.length; i++){
        	double sum = 0;
        	for(int k = 0; k < first[0].length; k++){
        		sum += first[i][k] * second[k];
        	}
        	out[i] = sum;
        }

		return out;
	}
	
	public String toStringWeights(){
		String out = "";
		for(int i = 0; i < neuralNetWeights.length; i++){
			for(int j = 0; j < neuralNetWeights[i].length; j++){
				for(int k = 0; k < neuralNetWeights[i][j].length; k++){
					out += neuralNetWeights[i][j][k] + " ";
				}
				out += "\n";
			}
			out += "\n";
		}
		
		return out;
	}
	
	public String toStringBias(){
		String out = "";
		for(int i = 0; i < neuralNetBias.length; i++){
			for(int j = 0; j < neuralNetBias[i].length; j++){
				out += neuralNetBias[i][j] + " ";
				out += "\n";
			}
			out += "\n";
		}
		
		return out;
	}
	
	public String toStringActivationFunction(){
		String out = "";
		for(int i = 0; i < neuralNetActivation.length; i++){
			for(int j = 0; j < neuralNetActivation[i].length; j++){
				out += neuralNetActivation[i][j] + " ";
				out += "\n";
			}
			out += "\n";
		}
		
		return out;
	}
	
	public String toStringZ(){
		String out = "";
		for(int i = 0; i < neuralNetZ.length; i++){
			for(int j = 0; j < neuralNetZ[i].length; j++){
				out += neuralNetZ[i][j] + " ";
				out += "\n";
			}
			out += "\n";
		}
		
		return out;
	}
	
	public static void main(String[] args){
		int[] hidden = {50,40,30,20,10};
		new ANN(1, hidden, 1);
	}

}
