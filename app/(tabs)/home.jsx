import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  RefreshControlComponent,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import { useForm } from "react-hook-form";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, isLoading, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const onRefresh = async () => {
    setRefreshing(true);
    // re call videos => if any new videos has been added
    await refetch();
    setRefreshing(false);
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      search: "",
    },
  });
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        // stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <View className="flex py-6 px-4 bg-primary relative">
            <View className="flex justify-between items-start flex-row w-full mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Gidysmart
                </Text>
              </View>
              <Image
                source={images.logoSmall}
                resizeMode="contain"
                className="w-9 h-10"
              />
            </View>
            <SearchInput
              placeholder="Search for a video topic"
              name="search"
              control={control}
            />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <Trending posts={latestPosts ?? []} />
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first on to upload a video "
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Home;
