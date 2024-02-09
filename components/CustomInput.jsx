import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Controller } from "react-hook-form";
import { icons } from '../constants';

const CustomInput = ({
  control,
  name,
  label,
  rules = {},
  placeholder,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View className={`space-y-2 ${otherStyles}`}>
          <Text className="text-gray-100 text-base font-pmedium ">{label}</Text>
          <View
            className={`bg-black-100 flex flex-row w-full justify-between items-center border-2 border-black-200 rounded-lg p-4 focus:border-secondary ${error && 'border border-red-700'}`}

            // style={[{ borderColor: error ? "red" : "#232533" }]}
          >
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              secureTextEntry={label === "Password" && !showPassword}
              placeholderTextColor="#7B7B8B"
              className="text-white flex-1 font-psemibold text-base"
              {...props}
            />
            {label === "Password" && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={!showPassword ? icons.eye : icons.eyeHide}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
          {error && (
            <Text style={{ color: "red", alignSelf: "stretch" }}>
              {error.message || "Error"}
            </Text>
          )}
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

export default CustomInput;
