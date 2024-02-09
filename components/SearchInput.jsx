import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      query: initialQuery || "",
    },
  });

  const queryString = watch("query");

  return (
    <Controller
      control={control}
      name={"query"}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View
          className={`flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary`}
        >
          <TextInput
            value={value || queryString}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={"Search for a video topic"}
            placeholderTextColor="#cdcde0"
            className="text-white flex-1 font-pregular text-base"
          />

          <TouchableOpacity
            onPress={() => {
              if (!queryString) {
                return Alert.alert(
                  "Missing query",
                  "Please input something to search results across database"
                );
              }

              if (pathname.startsWith("/search")) router.setParams({ query: queryString });
              else router.push(`/search/${queryString}`);
            }}
          >
            <Image
              source={icons.search}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",

    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {},
});

export default SearchInput;
