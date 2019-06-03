# Energy_Load_Forecasting

[Energy Load Prediction Presentation](https://matlickp.github.io/Energy_Load_Forecasting/)

## Scope

Energy Load is the amount of energy consumed over a specific area or consumer base at any given time. For this project we are going to be trying to predict what the energy load will be given some weater and time variables. Since energy companies purchase energy, like a commoditie, to be able to power the people they support, it is very important that they accurately predict what future loads will be in order to purchase enough but not too much that they lose money.

## Data Gathering and Cleaning

Taking historical weather data from 2014 - 2018, the data is sorted and only the relevant variables are extracted. 
Variables:
  Temperature (F)
  Dew Point
  Humidity
  Cloud Cover
  Day Of The Week
  Hour Of The Day
  
Also in a .csv is the hourly historical energy load consumed for the same time period. Both .csv's are joined together and the following table is produced in Tableau.

![Historical Data](Images/Historical_data.png?raw=true "Historical Data")

## Random Forrest Model

After creating the full historical data table, the data is split into X,y sets for the RandomForrest. Using a TimeseriesSplit, the model is tuned, trained, and tested. The results are then put into a dataframe and visualzed in Tableau.

![Prediction Visulaization](Images/Visual_predictions.png?raw=true "Prediction Visualization")

## Mongo Database

The historical dataset as well as projected weather data for 2019 was all saved into MongoDB to be used by the application.

## Flask and JS

The application is then created using flask and javascript to create an interface to allow for the choice of day and display of predicted data. 


## Application and Results

Loading the interface takes you to a homepage with an exlanation of energy loads and a reiteration of the Scope. 

![Homepage](Images/homepage.png?raw=true "Homepage")

After clicking into the "Model" page, you can then select a day from the dropdown of future weather forecasts and generate the predicted energy load by hour for that day.

![Results](Images/Prediction_results.png?raw=true "Predicted Results")

On the "Dashboard" page is the Tableau dashboard for more insight into the historical data. The most energy is consumed in the summer months when temperatures are higher and, on average, there is more consumption on weekdays than weekends.

![Dashboard](Images/tableau_dashboard.png?raw=true "Dashboard")


