import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SPACING } from "../theme/theme";
import SubMovieCard from "../components/SubMovieCard";
import { baseImagePath, searchMovies } from "../api/apicalls";
import InputHeader from "../components/InputHeader";

const { width, height } = Dimensions.get("screen");

const SearchScreen = ({ navigation }: any) => {
  const [searchList, setSearchList] = useState([]);

  const searchMoviesFunction = async (name: string) => {
    try {
      let response = await fetch(searchMovies(name));
      let json = await response.json();

      setSearchList(json.results);
    } catch (error) {
      console.error("Something went wring with searchMoviesFunction", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View>
        <FlatList
          data={searchList}
          keyExtractor={(item: any) => item.id}
          numColumns={2}
          ListHeaderComponent={
            <View style={styles.InputHeaderContainer}>
              <InputHeader searchFunction={searchMoviesFunction} />
            </View>
          }
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={styles.centerContainer}
          renderItem={({ item, index }) => (
            <SubMovieCard
              shoudlMarginatedAtEnd={false}
              shouldMarginatedAround={true}
              cardFunction={() => {
                navigation.push("MovieDetails", { movieid: item.id });
              }}
              cardWidth={width / 2 - SPACING.space_12 * 2}
              title={item.original_title}
              imagePath={baseImagePath("w342", item.poster_path)}
            />
          )}
        />
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    backgroundColor: COLORS.Black,
    width,
  },
  InputHeaderContainer: {
    display: "flex",
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
    marginBottom: SPACING.space_28 - SPACING.space_12,
  },
  centerContainer: {
    alignItems: "center",
  },
});
