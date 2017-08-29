package algorithm;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import db.DBConnection;
import db.DBConnectionFactory;
import entity.Item;

// Recommendation based on geo distance and similar categories.
public class GeoRecommendation implements Recommendation {

  @Override
  public List<Item> recommendItems(String userId, double lat, double lon) {
	// connect DB, we need to get category from DB
    DBConnection conn = DBConnectionFactory.getDBConnection();
    
    // step 1 get the user's favored items from DB
    Set<String> favoriteItems = conn.getFavoriteItemIds(userId);  // db queries
    
    // step 2 get all the categories of all favored items gained from step 1
    Set<String> allCategories = new HashSet<>(); 
    for (String item : favoriteItems) {
      allCategories.addAll(conn.getCategories(item));  // db queries
    }
    
    // step 3 search in external API based on the categories gained from step 2
    Set<Item> recommendedItems = new HashSet<>(); 
    for (String category : allCategories) {
      List<Item> items = conn.searchItems(userId, lat, lon, category);  // call external API
      recommendedItems.addAll(items);
    }
    allCategories.remove("Undefined");  // tune category set
    if (allCategories.isEmpty()) {
    	allCategories.add("");
    }

    // List is used for ranking later
    // step 4 filter the events, if the events are visited, filtered them out
    List<Item> filteredItems = new ArrayList<>();  
    for (Item item : recommendedItems) {
      if (!favoriteItems.contains(item.getItemId())) {
        filteredItems.add(item);
      }
    }

    // step 5 perform ranking of these items based on distance.
    Collections.sort(filteredItems, new Comparator<Item>() {
      @Override
      public int compare(Item item1, Item item2) {
    	// compare distances of two items from current location 
        double distance1 = getDistance(item1.getLatitude(), item1.getLongitude(), lat, lon);
        double distance2 = getDistance(item2.getLatitude(), item2.getLongitude(), lat, lon);
        // return the increasing order of distance.
        return (int) (distance1 - distance2);
      }
    });

    return filteredItems;
  }

  // Calculate the distances between two geolocations.
  // Source : http://andrew.hedges.name/experiments/haversine/
  private static double getDistance(double lat1, double lon1, double lat2, double lon2) {
    double dlon = lon2 - lon1;
    double dlat = lat2 - lat1;
    double a = Math.sin(dlat / 2 / 180 * Math.PI) * Math.sin(dlat / 2 / 180 * Math.PI)
        + Math.cos(lat1 / 180 * Math.PI) * Math.cos(lat2 / 180 * Math.PI)
            * Math.sin(dlon / 2 / 180 * Math.PI) * Math.sin(dlon / 2 / 180 * Math.PI);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Radius of earth in miles.
    double R = 3961;
    return R * c;
  }
}
