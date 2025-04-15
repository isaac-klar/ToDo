import { Text, View, ActivityIndicator, Button } from "react-native";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/login"); // Redirect if not logged in
      } else {
        setLoading(false); // Show content if logged in
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: "absolute", top: 50, left: 20 }}>
        <Button title="Add task" onPress={() => router.push("/todo/new")} />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Edit app/index.tsx to edit this screen.</Text>
      </View>
    </View>
  );
}
