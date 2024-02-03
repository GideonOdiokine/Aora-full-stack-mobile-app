import { View, Text, ScrollView, Image, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomInput from "../../components/CustomInput";
import { useForm } from "react-hook-form";
import { EMAIL_REGEX } from "../../utilities";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from '../../context/GlobalProvider';

const Register = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const { email, username, password } = data;
    try {
      const result = await createUser(email, password, username);
      //   set it to global state
      setUser(result);
      setIsLoggedIn(true);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white font-semibold my-10 font-psemibold">
            Sign up to Aora
          </Text>
          <CustomInput
            name="username"
            label={"Username"}
            control={control}
            placeholder="Username"
            rules={{
              required: "Username is required",
            }}
          />
          <CustomInput
            name="email"
            label={"Email"}
            control={control}
            placeholder="Email"
            otherStyles="mt-7"
            rules={{
              required: "Email is required",
              pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
            }}
            keyboardType="email-address"
          />
          <CustomInput
            name="password"
            control={control}
            placeholder="Password"
            label={"Password"}
            otherStyles="mt-7"
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password should be at least 8 characters long",
              },
            }}
          />

          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit(onSubmit)}
            containerStyles="mt-7"
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/login"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
