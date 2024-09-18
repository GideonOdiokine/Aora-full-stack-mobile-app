import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../../components/CustomInput";
import { useForm } from "react-hook-form";
import { Video, ResizeMode } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideoPost } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useGlobalContext();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      video: null,
      thumbnail: null,
      prompt: "",
    },
  });

  const video = watch("video");
  const thumbnail = watch("thumbnail");

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (selectType === "image") {
        setValue("thumbnail", result.assets[0]);
      }
      if (selectType === "video") {
        setValue("video", result.assets[0]);
      }
    }
  };

  const onSubmit = async (data) => {
    if (!data) {
      return Alert.alert("Please fill in all the fields");
    }
    setUploading(true);
    try {
        console.log(data)
      await createVideoPost({
        ...data,
        userId: user.$id,
      });
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
        console.log(error)
      Alert.alert(error.message);
    } finally {
      reset();
      setUploading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-white text-2xl font-psemibold">Upload Video</Text>
        <CustomInput
          name="title"
          label={"Video Title"}
          control={control}
          placeholder="Give your video a catch title..."
          otherStyles={"mt-10"}
          rules={{
            required: "Video Title is required",
          }}
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {video ? (
              <Video
                source={{ uri: video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full px-4 h-40 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {thumbnail ? (
              <Image
                source={{ uri: thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full px-4 h-16 bg-black-100 rounded-2xl justify-center items-center border-black-200 border-2 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <CustomInput
          name="prompt"
          label={"AI Prompt"}
          control={control}
          placeholder="The AI prompt of your video..."
          otherStyles={"mt-7"}
          rules={{
            required: "AI prompt is required",
          }}
        />
        <CustomButton
          title="Submit & Publish"
          isLoading={uploading}
          containerStyles={"mt-7"}
          handlePress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
