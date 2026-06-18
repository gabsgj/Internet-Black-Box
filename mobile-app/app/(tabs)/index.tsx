import {
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";

import { useState } from "react";

import IncidentCard from "../../components/IncidentCard";

import { incidents } from "../../mock/incidents";

export default function FeedScreen() {
  const [refreshing, setRefreshing] =
    useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IncidentCard
            incident={item}
            onPress={() =>
              console.log(item.id)
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
}