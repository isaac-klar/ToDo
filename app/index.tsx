import {
  Text,
  View,
  ActivityIndicator,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
};

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      if (error || !user) {
        setError("User not authenticated.");
        return;
      }

      const { data: todosData, error: todosError } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id);

      if (todosError) {
        setError(todosError.message);
      } else {
        setTodos(todosData);
      }
    };
    fetchTodos();
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
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 120, paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/todo/${item.id}`)}>
              <View
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Text style={{ fontSize: 18 }}>{item.title}</Text>
                <Text style={{ color: item.completed ? "green" : "gray" }}>
                  {item.completed ? "✅ Completed" : "⬜ Not completed"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
