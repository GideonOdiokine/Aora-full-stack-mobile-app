import { View, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import EmptyState from "../../components/EmptyState";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { router } from 'expo-router';

const Profile = () => {
  const { user, setIsLoggedIn, setUser } = useGlobalContext();
  const { data: posts, isLoading } = useAppwrite(() => getUserPosts(user?.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/login");
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <>
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              creator={item.creator.username}
              avatar={item.creator.avatar}
            />
          </>
        )}
        // stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <View className="w-full flex relative justify-center items-center pb-4 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end pt-3 mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {isLoading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <EmptyState
                title="No Videos Found"
                subtitle="No videos found for this search query"
              />
            )}
          </>
        )}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Profile;
