// app/todo/new.tsx
import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function NewTodoScreen() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddTodo = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a todo title.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Error", "User not authenticated.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("todos").insert([
      {
        title: title.trim(),
        completed: false,
        user_id: user.id, // make sure this column exists in your table
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      router.back(); // go back to home screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New Todo</Text>
      <TextInput
        placeholder="What do you have to do?"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Button
        title={loading ? "Adding..." : "Add Todo"}
        onPress={handleAddTodo}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
