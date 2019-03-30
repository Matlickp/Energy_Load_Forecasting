# Energy_Load_Forecasting

Energy Load is the amount of energy consumed over a specific area or consumer base at any given time. For this project we are going to be trying to predict what the energy load will be given some weater and time variables. Since energy companies purchase energy, like a commoditie, to be able to power the people they support, it is very important that they accurately predict what future loads will be in order to purchase enough but not too much that they lose money.

Variables:
  Temperature (F)
  Dew Point
  Humidity
  Cloud Cover
  Day Of The Week
  Hour Of The Day
  
Using historical data or the variables and historical loads going back to 2014, we used a TimeSeriesSplit and then Randomn Forest Regressor to st up a model that would predict loads based on forcasted weather data. 
