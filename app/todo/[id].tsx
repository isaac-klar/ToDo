import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
};

export default function TodoScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTodo = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        setError(error.message);
      } else {
        setTodo(data);
      }
      setLoading(false);
    };
    fetchTodo();
  }, [id]);

  const handleToggle = async () => {
    if (!todo) return;

    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", todo.id);

    if (error) {
      setError(error.message); // optional: show error in UI
    } else {
      setTodo({ ...todo, completed: !todo.completed }); // update local state
    }
  };

  const handleDelete = async () => {
    if (!todo) return;
    const { error } = await supabase.from("todos").delete().eq("id", todo.id);
    if (error) {
      setError(error.message);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!todo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Todo not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>{todo.title}</Text>
      <Text>{todo.completed ? "✅ Completed" : "Not completed yet"}</Text>

      <View style={{ marginTop: 20 }}>
        <Button
          title={todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
          onPress={handleToggle}
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Delete" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}
