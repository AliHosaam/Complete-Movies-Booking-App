import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./navigators/TabNavigator";
import MovieDetailsScreen from "./screens/MovieDetailsScreen";
import SeatBookingScreen from "./screens/SeatBookingScreen";
import { RootSiblingParent } from "react-native-root-siblings";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{ animation: "default" }}
          />
          <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="SeatBooking"
            component={SeatBookingScreen}
            options={{ animation: "slide_from_bottom" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
};

export default App;
