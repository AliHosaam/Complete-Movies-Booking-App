import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import AppHeader from "../components/AppHeader";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FlatList } from "react-native";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-root-toast";

const timeArray: string[] = [
  "10:30",
  "12:30",
  "14:30",
  "15:00",
  "19:30",
  "21:00",
];

const generateDate = () => {
  const date = new Date();
  let weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let weekdays = [];
  for (let i = 0; i < 7; i++) {
    const tempDate = {
      date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
      day: weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
    };

    weekdays.push(tempDate);
  }

  return weekdays;
};

const generateSeats = () => {
  let numRow = 8;
  let numColumn = 3;
  let rowArray = [];
  let start = 1;
  let reachNine = false;

  for (let i = 0; i < numRow; i++) {
    let columnArray = [];
    for (let j = 0; j < numColumn; j++) {
      let seatObject = {
        number: start,
        taken: Boolean(Math.round(Math.random())),
        selected: false,
      };
      columnArray.push(seatObject);
      start++;
    }
    if (i === 3) {
      numColumn += 2;
    }
    if (numColumn < 9 && !reachNine) {
      numColumn += 2;
    } else {
      reachNine = true;
      numColumn -= 2;
    }

    rowArray.push(columnArray);
  }

  return rowArray;
};

const SeatBookingScreen = ({ navigation, route }: any) => {
  const [dateArray, setDateArray] = useState<any[]>(generateDate());
  const [selectedDateIndex, setSelectedDateIndex] = useState<any>();
  const [price, setPrice] = useState<number>(0);
  const [seatsArray, setSeatsArray] = useState<any[][]>(generateSeats());
  const [selectedSeatArray, setSelectedSeatArray] = useState([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<any>();

  const selectSeat = (index: number, subindex: number, num: number) => {
    if (!seatsArray[index][subindex].taken) {
      let array: any = [...selectedSeatArray];
      let temp = [...seatsArray];
      temp[index][subindex].selected = !temp[index][subindex].selected;

      if (!array.includes(num)) {
        array.push(num);
        setSelectedSeatArray(array);
      } else {
        let tempIndex = array.indexOf(num);
        if (tempIndex > -1) {
          array.splice(tempIndex, 1);
          setSelectedSeatArray(array);
        }
      }
      setPrice(array.length * 5.0);
      setSeatsArray(temp);
    }
  };

  const BookSeats = async () => {
    if (
      selectedSeatArray.length !== 0 &&
      timeArray[selectedTimeIndex] !== undefined &&
      dateArray[selectedDateIndex] !== undefined
    ) {
      try {
        await SecureStore.setItemAsync(
          "ticket",
          JSON.stringify({
            seatArray: selectedSeatArray,
            time: timeArray[selectedTimeIndex],
            date: dateArray[selectedDateIndex],
            ticketImage: route.params.PosterImage,
          })
        );
      } catch (error) {
        console.log("Something went wring while storing in BookSeats Function");
      }

      navigation.navigate("Ticket", {
        seatArray: selectedSeatArray,
        time: timeArray[selectedTimeIndex],
        date: dateArray[selectedDateIndex],
        ticketImage: route.params.PosterImage,
      });
    } else {
      Toast.show("Please Select Seats, Date and Time of the Show", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar hidden />
      <View>
        <ImageBackground
          source={{ uri: route.params?.BgImage }}
          style={styles.ImageBG}
        >
          <LinearGradient
            colors={[COLORS.BlackRGB10, COLORS.Black]}
            style={styles.linerGradient}
          >
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header=""
                action={() => navigation.goBack()}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.screenText}>Screen this side</Text>
      </View>

      <View style={styles.seatContainer}>
        <View style={styles.containerGap20}>
          {seatsArray.map((item, index) => {
            return (
              <View key={index} style={styles.seatRow}>
                {item.map((subitem, subindex) => {
                  return (
                    <TouchableOpacity
                      key={subitem.number}
                      onPress={() => {
                        selectSeat(index, subindex, subitem.number);
                      }}
                    >
                      <Icon
                        name="chair"
                        style={[
                          styles.seatIcon,
                          subitem.taken
                            ? { color: COLORS.Grey }
                            : { color: COLORS.White },
                          subitem.selected ? { color: COLORS.Orange } : {},
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>

        <View style={styles.seatRadioContainer}>
          <View style={styles.radioContainer}>
            <Icon name="circle" style={styles.radioIcon} />
            <Text style={styles.radioText}>Available</Text>
          </View>
          <View style={styles.radioContainer}>
            <Icon
              name="circle"
              style={[styles.radioIcon, { color: COLORS.Grey }]}
            />
            <Text style={styles.radioText}>Taken</Text>
          </View>
          <View style={styles.radioContainer}>
            <Icon
              name="circle"
              style={[styles.radioIcon, { color: COLORS.Orange }]}
            />
            <Text style={styles.radioText}>Selected</Text>
          </View>
        </View>
      </View>

      <View>
        <FlatList
          data={dateArray}
          keyExtractor={(item) => item.date}
          bounces={false}
          horizontal
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedDateIndex(index);
                }}
              >
                <View
                  style={[
                    styles.dateContainer,
                    index === 0
                      ? { marginLeft: SPACING.space_24 }
                      : index === dateArray.length - 1
                      ? { marginRight: SPACING.space_24 }
                      : {},
                    index === selectedDateIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}
                >
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.outerContainer} />

      <View>
        <FlatList
          data={timeArray}
          keyExtractor={(item) => item}
          bounces={false}
          horizontal
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTimeIndex(index);
                }}
              >
                <View
                  style={[
                    styles.timeContainer,
                    index === 0
                      ? { marginLeft: SPACING.space_24 }
                      : index === dateArray.length - 1
                      ? { marginRight: SPACING.space_24 }
                      : {},
                    index === selectedTimeIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}
                >
                  <Text style={styles.timeText}>{item}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.buttonPriceContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPriceText}>Total Price</Text>
          <Text style={styles.price}>$ {price}.00</Text>
        </View>
        <TouchableOpacity onPress={BookSeats} style={styles.button}>
          <Text style={styles.buttonText}>Buy Tickets</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SeatBookingScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  ImageBG: {
    width: "100%",
    aspectRatio: 3072 / 1727,
  },
  linerGradient: {
    height: "100%",
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  screenText: {
    textAlign: "center",
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA32,
    fontWeight: "bold",
  },
  seatContainer: {
    marginVertical: SPACING.space_20,
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  seatRow: {
    flexDirection: "row",
    gap: SPACING.space_20,
    justifyContent: "center",
  },
  seatIcon: {
    fontSize: FONTSIZE.size_20,
  },
  seatRadioContainer: {
    flexDirection: "row",
    marginVertical: SPACING.space_36,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: SPACING.space_10,
  },
  radioContainer: {
    flexDirection: "row",
    gap: SPACING.space_10,
    alignItems: "center",
  },
  radioIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  radioText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
    fontWeight: "bold",
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  dateContainer: {
    width: SPACING.space_10 * 7,
    height: SPACING.space_10 * 10,
    borderRadius: BORDERRADIUS.radius_10 * 10,
    backgroundColor: COLORS.DarkGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    fontWeight: "bold",
  },
  dayText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
    fontWeight: "bold",
    marginTop: SPACING.space_10,
  },
  timeContainer: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    backgroundColor: COLORS.DarkGrey,
    borderRadius: BORDERRADIUS.radius_20,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
    fontWeight: "bold",
  },
  outerContainer: {
    marginVertical: SPACING.space_10,
  },
  buttonPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.space_24,
    paddingBottom: SPACING.space_36,
    paddingVertical: SPACING.space_24,
  },
  priceContainer: {
    alignItems: "center",
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Grey,
  },
  price: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  buttonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
    fontWeight: "bold",
  },
  button: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
    backgroundColor: COLORS.Orange,
  },
});
