import { View, Text, FlatList  } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SearchInput from "../../components/SearchInput";
import { useForm } from "react-hook-form";
import EmptyState from "../../components/EmptyState";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

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
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <View className="flex py-6 px-4 bg-primary">
            <Text className="font-pmedium text-sm text-gray-100">
              Search results
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput
                placeholder="Search for a video topic"
                initialQuery={query}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Search;
