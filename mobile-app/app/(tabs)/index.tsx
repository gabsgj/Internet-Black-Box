import {
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";

import { useState } from "react";

import IncidentCard from "../../components/IncidentCard";

import { useMobileStore } from "../../store/useMobileStore";

import { incidents as mockIncidents } from "../../mock/incidents";

import { router } from "expo-router";

import { useEffect } from "react";

export default function FeedScreen() {
  const [refreshing, setRefreshing] =
    useState(false);

    const {
        incidents,
        setIncidents,
        setSelectedIncident,
        } = useMobileStore();

        useEffect(() => {
        setIncidents(mockIncidents);
        }, []);

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
            onPress={() => {
                setSelectedIncident(item);
                router.push(`/incident/${item.id}`);
            }}
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