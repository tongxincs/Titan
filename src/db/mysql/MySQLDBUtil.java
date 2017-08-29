package db.mysql;

/**
 * @author Tongxin90
 * this class is used to store all the info of the connection with the MySQL database
 * etc.port NO, Hostname, DB_Name, Username, Passward, and request message
 */
public class MySQLDBUtil {
  private static final String HOSTNAME = "localhost";
  private static final String PORT_NUM = "3306";// change it to your mysql port number
  public static final String DB_NAME = "laiproject";
  private static final String USERNAME = "root";
  private static final String PASSWORD = "root";
  public static final String URL = "jdbc:mysql://" + HOSTNAME + ":" + PORT_NUM + "/" + DB_NAME
      + "?user=" + USERNAME + "&password=" + PASSWORD + "&autoreconnect=true";
}
