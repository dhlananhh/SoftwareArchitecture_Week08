import redis.clients.jedis.Jedis;
import java.sql.*;

public class Worker {
    public static void main(String[] args) {
        Jedis redis = new Jedis("redis");
        Connection dbConnection = null;

        try {
            Class.forName("org.postgresql.Driver");
            dbConnection = DriverManager.getConnection(
                    "jdbc:postgresql://db:5432/postgres", "postgres", "postgres");
            System.out.println("Successfully connected to PostgreSQL database.");

            Statement stmt = dbConnection.createStatement();
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS votes (option VARCHAR(255) PRIMARY KEY, count INT)");
            System.out.println("Successfully created the 'votes' table if it didn't exist.");
            stmt.close();

            while (true) {
                String key = null;
                try {
                  key = redis.keys("*").stream().findFirst().orElse(null);
                }
                catch(Exception ex) {
                  System.out.println("Error getting key: "+ ex);
                }
                if(key != null) {
                    try{
                       Long count = redis.incrBy(key, 0);
                       PreparedStatement pstmt = dbConnection.prepareStatement(
                               "INSERT INTO votes (option, count) VALUES (?, ?) ON CONFLICT (option) DO UPDATE SET count = ?");
                       pstmt.setString(1, key);
                       pstmt.setLong(2, count);
                       pstmt.setLong(3, count);
                       pstmt.executeUpdate();
                       pstmt.close();
                       System.out.println("Updated count for option: " + key + " to " + count + " in database.");

                       redis.del(key);
                       System.out.println("Delete successfully for option: " + key + " in redis.");
                    } catch (SQLException ex) {
                        System.out.println("Error insert or update option: "+ key + " error: "+ ex);
                    }
                }
                Thread.sleep(1000);
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            try {
                if (dbConnection != null) {
                    dbConnection.close();
                }
                if (redis != null) {
                  redis.close();
                }
            } catch (Exception e) {
                System.out.println("Error closing resources: " + e.getMessage());
            }
        }
    }
}
