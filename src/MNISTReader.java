import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.UnknownHostException;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

/**
 * This class implements a reader for the MNIST dataset of handwritten digits. The dataset is found
 * at http://yann.lecun.com/exdb/mnist/.
 * 
 * @author Gabe Johnson <johnsogg@cmu.edu>
 */
public class MNISTReader {

	private MongoClient mongoClient;
	private DB db;
	private DBCollection coll;
	private DBCollection sys;

	public MNISTReader(String[] args){
		if(args.length == 3){
			try {
				DataInputStream labels = new DataInputStream(new FileInputStream(args[0]));
				DataInputStream images = new DataInputStream(new FileInputStream(args[1]));

				mongoClient = new MongoClient();
				db = mongoClient.getDB("MNISTDB");
				coll = db.getCollection(args[2]);


				int magicNumber = labels.readInt();
				if (magicNumber != 2049) {
					System.err.println("Label file has wrong magic number: " + magicNumber + " (should be 2049)");
					System.exit(0);
				}
				magicNumber = images.readInt();
				if (magicNumber != 2051) {
					System.err.println("Image file has wrong magic number: " + magicNumber + " (should be 2051)");
					System.exit(0);
				}
				int numLabels = labels.readInt();
				int numImages = images.readInt();
				int numRows = images.readInt();
				int numCols = images.readInt();
				if (numLabels != numImages) {
					System.err.println("Image file and label file do not contain the same number of entries.");
					System.err.println("  Label file contains: " + numLabels);
					System.err.println("  Image file contains: " + numImages);
					System.exit(0);
				}

				long start = System.currentTimeMillis();
				int numLabelsRead = 0;
				int numImagesRead = 0;
				while (labels.available() > 0 && numLabelsRead < numLabels) {
					byte label = labels.readByte();
					numLabelsRead++;
					int[][] image = new int[numCols][numRows];
					for (int colIdx = 0; colIdx < numCols; colIdx++) {
						for (int rowIdx = 0; rowIdx < numRows; rowIdx++) {
							image[colIdx][rowIdx] = images.readUnsignedByte();
						}
					}
					numImagesRead++;

					// At this point, 'label' and 'image' agree and you can do whatever you like with them.
					BasicDBObject doc = new BasicDBObject(args[2], 0)
						.append("label", label)
						.append("image", image);
					
					coll.insert(doc);


					if (numLabelsRead % 10 == 0) {
						System.out.print(".");
					}
					if ((numLabelsRead % 800) == 0) {
						System.out.print(" " + numLabelsRead + " / " + numLabels);
						long end = System.currentTimeMillis();
						long elapsed = end - start;
						long minutes = elapsed / (1000 * 60);
						long seconds = (elapsed / 1000) - (minutes * 60);
						System.out.println("  " + minutes + " m " + seconds + " s ");
					}
				}
				System.out.println();
				long end = System.currentTimeMillis();
				long elapsed = end - start;
				long minutes = elapsed / (1000 * 60);
				long seconds = (elapsed / 1000) - (minutes * 60);
				System.out
				.println("Read " + numLabelsRead + " samples in " + minutes + " m " + seconds + " s ");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}


	/**
	 * @param args
	 *          args[0]: label file; args[1]: data file.
	 * @throws IOException
	 */
	public static void main(String[] args) throws IOException {
		new MNISTReader(args);
	}


}

