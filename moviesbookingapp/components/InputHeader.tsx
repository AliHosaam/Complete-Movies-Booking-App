import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/theme";
import Icon from "react-native-vector-icons/FontAwesome";

const InputHeader = ({ searchFunction }: any) => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <View style={styles.inputBox}>
      <TextInput
        style={styles.textInput}
        onChangeText={(textInput) => {
          setSearchText(textInput);
        }}
        value={searchText}
        placeholder="Search your Movies..."
        placeholderTextColor={COLORS.WhiteRGBA32}
      />

      <TouchableOpacity
        style={styles.searchIcon}
        onPress={() => searchFunction(searchText)}
      >
        <Icon name="search" size={FONTSIZE.size_20} color={COLORS.Orange} />
      </TouchableOpacity>
    </View>
  );
};

export default InputHeader;

const styles = StyleSheet.create({
  inputBox: {
    display: "flex",
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_8,
    borderWidth: 2,
    borderColor: COLORS.WhiteRGBA15,
    borderRadius: BORDERRADIUS.radius_25,
    flexDirection: "row",
    marginTop: SPACING.space_36,
    height: SPACING.space_32 * 2,
  },
  textInput: {
    width: "90%",
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  searchIcon: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.space_10,
  },
});
